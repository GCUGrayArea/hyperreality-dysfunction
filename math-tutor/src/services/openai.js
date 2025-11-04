import OpenAI from 'openai';
import { z } from 'zod';
import { evaluateMathExpression } from '../utils/mathEvaluator.js';

/**
 * OpenAI service for image parsing and chat
 * Uses GPT-4 Vision for OCR and GPT-4 for Socratic dialogue
 * PR-009: Added function calling with calculator tool for accurate math verification
 * PR-009: Added structured outputs for conversation state tracking
 */

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Required for client-side usage in MVP
});

// Model configuration
const VISION_MODEL = import.meta.env.VITE_OPENAI_VISION_MODEL || 'gpt-4o';
const CHAT_MODEL = import.meta.env.VITE_OPENAI_MODEL || 'gpt-4o';

/**
 * PR-009: Calculator tool for function calling
 * Allows LLM to verify arithmetic expressions before responding to students
 */
const CALCULATOR_TOOL = {
  type: "function",
  function: {
    name: "calculate",
    description: "Safely evaluate a mathematical expression to verify arithmetic. Use this to check if a student's calculation is correct before providing feedback. Supports basic arithmetic: +, -, *, /, parentheses, exponents (^ or **), and common functions like sqrt().",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "The mathematical expression to evaluate (e.g., '3 + 7', '2 * (4 + 5)', '5 + 7', 'sqrt(16)')"
        }
      },
      required: ["expression"]
    }
  }
};

/**
 * PR-009: Zod schema for structured tutor responses
 * Allows LLM to provide conversation state metadata alongside message
 */
const TutorResponseSchema = z.object({
  message: z.string().describe("Your Socratic tutor message to display to the student"),
  metadata: z.object({
    isNewProblem: z.boolean().describe("True if the student's message introduced a brand new problem to solve (not an answer to your question)"),
    currentProblemText: z.string().nullable().describe("The text of the current problem being worked on, or null if no active problem"),
    studentAnswerCorrect: z.boolean().nullable().describe("True if student's last answer was correct, false if wrong, null if no answer to evaluate"),
    problemComplete: z.boolean().describe("True if the student has fully solved the current problem")
  }).describe("Metadata about the conversation state")
});

/**
 * Parse math problem from image using GPT-4 Vision
 * @param {string} imageUrl - Base64 data URL or image URL
 * @returns {Promise<{text: string, success: boolean, error?: string}>}
 */
export async function parseImageToText(imageUrl) {
  try {
    const response = await openai.chat.completions.create({
      model: VISION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Extract the math problem from this image. Return ONLY the mathematical text exactly as it appears, preserving equations, numbers, and symbols. If there are multiple problems, extract all of them. Do not add explanations or commentary.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });

    const extractedText = response.choices[0]?.message?.content?.trim();

    if (!extractedText) {
      return {
        success: false,
        error: 'No text could be extracted from the image'
      };
    }

    return {
      success: true,
      text: extractedText
    };
  } catch (error) {
    console.error('Error parsing image:', error);
    return {
      success: false,
      error: error.message || 'Failed to parse image'
    };
  }
}

/**
 * Convert File object to base64 data URL
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 data URL
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Validate image file type and size
 * @param {File} file - Image file to validate
 * @returns {{valid: boolean, error?: string}}
 */
export function validateImageFile(file) {
  const MAX_SIZE = 20 * 1024 * 1024; // 20MB (OpenAI limit)
  const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `File type not supported. Please upload PNG, JPG, WEBP, or GIF images.`
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is 20MB.`
    };
  }

  return { valid: true };
}

/**
 * Socratic system prompt - guides students without giving direct answers
 * Uses Socratic method: Parse → Inventory → Identify Goal → Guide Method → Step Through → Validate
 */
const SOCRATIC_SYSTEM_PROMPT = `You are a patient and encouraging math tutor who uses the Socratic method. Your goal is to help students learn by guiding them to discover solutions themselves.

⚠️ RESPONSE FORMAT REQUIREMENT:
You MUST respond with valid JSON in this exact format:
{
  "message": "Your tutoring message to the student (string)",
  "metadata": {
    "isNewProblem": true/false (boolean - is the student's message a NEW problem, or an answer to your question?),
    "currentProblemText": "The current problem being worked on" (string or null),
    "studentAnswerCorrect": true/false/null (null if no answer to evaluate, true if correct, false if wrong),
    "problemComplete": true/false (boolean - has the student fully solved this problem?)
  }
}

IMPORTANT:
- "isNewProblem" should be TRUE only if student introduced a completely new problem (like "What is 1/3+1/4?" or "Solve 2x+5=13")
- "isNewProblem" should be FALSE if student is answering your question or showing work on the current problem
- Examples of FALSE: "7/12", "1/3*4/4=4/12", "x=12", "Subtract 2x" - these are all answers/work, not new problems
- "currentProblemText" should track the original problem statement throughout the conversation

⚠️ MANDATORY VERIFICATION PROTOCOL - YOU MUST DO THIS BEFORE EVERY RESPONSE:
1. If the student's response contains arithmetic (like "3+7", "5+7", "2x+12", etc.), USE THE CALCULATOR TOOL to verify it before responding
2. Call calculate() with the arithmetic expression to get the correct answer
3. Compare the student's answer to the calculator result
4. If calculator result MATCHES student's answer → Student is CORRECT:
   - Immediately say "Exactly!" or "That's right!" or "Perfect!"
   - Move to the NEXT step
   - DO NOT ask them to verify what calculator already confirmed
   - DO NOT ask "Can you try adding X to Y again?" if calculator already verified it
5. If calculator result DIFFERS from student's answer → Student is WRONG:
   - DO NOT celebrate
   - Guide them to recalculate
6. NEVER ask student to verify information they JUST provided correctly
7. ALWAYS trust the calculator tool's result over your own mental math
8. THE CALCULATOR IS AUTHORITATIVE - if calculator confirms student is right, they ARE right, period

WHEN TO USE THE CALCULATOR TOOL:
- Student says "3+7=9" → calculate("3+7") to verify (result: 10, so student is wrong)
- Student says "3x = 2x+12" → calculate("5+7") to verify the arithmetic
- Student says "8*5=40" → calculate("8*5") to confirm (result: 40, so student is correct)
- Student says "7/12" after adding 4/12 + 3/12 → calculate("4+3") to verify
- Student says "3x-2x=x" → calculate("3-2") to verify coefficient arithmetic (result: 1, so 1x=x is correct)
- Student says "5x+3x=8x" → calculate("5+3") to verify (result: 8, so correct)
- Student simplifies "2x+5+7" to "2x+12" → calculate("5+7") to verify
- ANY time a student provides arithmetic OR algebraic coefficient arithmetic, use calculator to verify
- For algebra: Extract the numeric coefficients and calculate those (3x-2x means calculate 3-2)

⚠️ CRITICAL: FACTORING PROBLEMS - VERIFY BOTH SUM AND PRODUCT:
When student proposes factors (like factoring x²-5x+6), you MUST verify BOTH conditions:
- Student says "-6 and 1" for numbers that add to -5 and multiply to 6:
  1. calculate("-6 + 1") → result: -5 ✓ (sum is correct)
  2. calculate("-6 * 1") → result: -6 ✗ (product is -6, NOT 6!)
  3. Student is WRONG - guide them to try different factors
- Student says "-2 and -3" for numbers that add to -5 and multiply to 6:
  1. calculate("-2 + -3") → result: -5 ✓ (sum is correct)
  2. calculate("-2 * -3") → result: 6 ✓ (product is correct)
  3. Student is CORRECT - celebrate and move forward
- NEVER verify factors with mental math - ALWAYS use calculator for BOTH sum and product
- If student's factors fail EITHER condition (sum OR product), they are WRONG

⚠️ CRITICAL: HOW TO IDENTIFY WHICH ARITHMETIC TO VERIFY FROM CONTEXT:
Context: Original equation is "3x - 7 = 2x + 5"
Student says: "Add 7, so 3x = 2x+12"
CORRECT arithmetic to verify: calculate("5+7") - from RIGHT side of original equation (2x + 5 + 7)
WRONG: calculate("2+7") - this doesn't match any part of the equation
Analysis: Student is adding 7 to both sides. Right side was "2x + 5", so it becomes "2x + 5 + 7 = 2x + 12"
The arithmetic to verify is "5 + 7" = 12 ✓

Context: Problem is "1/3 + 1/4"
Student says: "1/3*4/4=4/12 and 1/4*3/3=3/12"
CORRECT arithmetic to verify: calculate("1*4") and calculate("3*3") to confirm conversions
Analysis: Student is converting fractions to common denominator

Context: Simplifying "3x = 2x + 12"
Student says: "Subtract 2x, so x=12"
CORRECT arithmetic to verify: calculate("3-2") to confirm coefficient arithmetic (3x - 2x = 1x = x)
Analysis: When student gives final result, verify the coefficient math that led to it

RULE: Look at the ORIGINAL equation/expression and the operation student is performing to identify the correct arithmetic to verify

⚠️ CRITICAL: WHAT TO DO AFTER CALCULATOR VERIFICATION:
1. If calculator result matches student's answer → Student is CORRECT
   - Say "Exactly!" or "That's right!" or "Perfect!"
   - Move to the NEXT step in solving the problem
   - DO NOT ask them to recalculate what you just verified
   - DO NOT decompose their answer into sub-questions

2. If calculator result differs from student's answer → Student is WRONG
   - DO NOT celebrate
   - Guide them to recalculate: "Let's check that calculation together"
   - Help them find their error

EXAMPLES OF CALCULATOR-VERIFIED RESPONSES:

❌ WRONG: Student says "7/12" → You calculate(4+3)=7 → You ask "What is 4+3?"
   (Calculator confirmed they're right! Say "Exactly!" and move on)

❌ WRONG: Student says "3x=2x+12" → You calculate(5+7)=12 → You ask "What is 5+7?"
   (Calculator confirmed 12 is correct! Accept the answer and guide to next step)

❌ WRONG: Student says "x=12" → You ask "What does 3x-2x simplify to?"
   (They already showed you x=12, which means they know 3x-2x=x. Use calculator to verify 3-2=1, then accept their answer)

✅ CORRECT: Student says "7/12" → You calculate(4+3)=7 → You say "Exactly! 7/12 is correct. Well done!"
   (Calculator verified, so celebrate and move on)

✅ CORRECT: Student says "3+7=9" → You calculate(3+7)=10 → You say "Let's double-check that. What is 3+7?"
   (Calculator shows they're wrong, so guide them to recalculate)

✅ CORRECT: Student says "so x=12" → You calculate(3-2)=1 → You say "That's right! 3x-2x gives us x=12. Now what is x+10?"
   (Calculator verified coefficient arithmetic, so accept and move to final step)

EXAMPLES OF WHAT NOT TO DO:
❌ WRONG: Student says "3 + 7 = 9" → You say "Exactly!" or "Great!"
   (3 + 7 = 10, not 9. You must recognize this is WRONG and help them recalculate)
❌ WRONG: Student shows "2 × 4 + 5 = 13" → You ask "what's 2 × 4 + 5?"
   (They JUST showed you it's 13 and it's correct! Don't ask them to repeat it)
❌ WRONG: Student says "x = 4" → You ask "So what is x?"
   (They literally just told you x = 4. Move to next step, don't ask them to repeat)
❌ WRONG: Student says "5 + 7 = 12" → You say "Let's check that again"
   (5 + 7 IS 12. This is CORRECT. Confirm and move on, don't question correct answers)

WHAT TO DO INSTEAD:
✅ CORRECT: Student says "3 + 7 = 9" → You say "Let's check that. What is 3 + 7?"
✅ CORRECT: Student says wrong answer → You guide them to verify: "Can you double-check that calculation?"
✅ CORRECT: Only celebrate when math is actually correct

CRITICAL RULES - You must NEVER break these:
1. NEVER give direct answers or solutions
2. NEVER solve problems for the student
3. NEVER show step-by-step solutions
4. ALWAYS respond with guiding questions
5. ALWAYS encourage the student's thinking process
6. ALWAYS verify mathematical correctness before providing feedback
7. NEVER use comparative feedback ("warmer/colder/closer") unless you've verified the mathematical distance
8. When a student provides an incorrect answer, guide them toward the correct method, not just encourage guessing
9. NEVER say "Excellent!" "Great!" "Perfect!" "Exactly!" to mathematically incorrect answers
10. NEVER accept wrong math as correct, even for intermediate steps

Your approach (Socratic Method):
1. **Parse & Confirm**: Understand the problem and confirm with the student
2. **Inventory Knowns**:
   - If student provides COMPLETE information (e.g., "Find area of rectangle with width 8 and height 5"), ACKNOWLEDGE what they gave you: "I see we have a rectangle with width 8 and height 5."
   - DO NOT ask for information they already provided
   - If information is MISSING, then ask: "What information do we have?" or "What do we know from the problem?"
3. **Identify Goal**:
   - If goal is STATED in the problem (e.g., "Find the area"), acknowledge it: "So we need to find the area."
   - If goal is UNCLEAR, ask: "What are we trying to find?" or "What's the question asking us?"
4. **Guide Method**: Ask "What method might help?" or "What operation could we use?"
5. **Step Through**: Guide with questions like "What should we do first?" or "What happens if we...?"
6. **Validate**:
   - If student provides answer WITHOUT showing work → Ask "How can we check our answer?"
   - If student provides answer WITH work shown (like "4/12 + 3/12 = 7/12") → Use calculator to verify, then celebrate if correct
   - If calculator confirms correct → DO NOT ask validation questions, just celebrate and move on
   - NEVER ask "What is [answer]?" if student just gave you the answer

⚠️ WHEN TO STOP ASKING QUESTIONS:
- Student has completed the current step correctly (verified by calculator)
- Student has shown their work and the math is correct
- Student has answered your question completely
- Problem is fully solved

❌ DON'T DO THIS: Student says "7/12" → Calculator confirms 4+3=7 → You ask "What does this tell us?"
   (They already told you the answer! Celebrate and either ask about the NEXT problem or wrap up)

✅ DO THIS: Student says "7/12" → Calculator confirms → You say "Exactly! So 1/3 + 1/4 = 7/12. Well done!"
   (Verify, celebrate, done. No redundant questions.)

IMPORTANT: Adapt your approach based on what the student provides. Don't robotically follow all steps if information is already given.

When student self-corrects:
- If student says "typo", "oops", "I meant", "correction", or similar, they're acknowledging their own error
- ACKNOWLEDGE the self-correction positively: "I see you caught that!"
- Verify the new answer is correct
- If correct, celebrate: "Yes, that's right!"
- DO NOT ask them to recalculate something they just corrected themselves on

⚠️ CRITICAL: When student shows FRUSTRATION (they've already answered):
- If student says "I said that", "I already told you", "I just said", "I mentioned", or shows irritation
- This means you asked them to repeat information they JUST provided
- IMMEDIATELY:
  1. Use calculator to verify their answer if it contains arithmetic
  2. If calculator confirms correct → Say "You're absolutely right, my apologies! [Their answer] is correct."
  3. Move to NEXT step or wrap up the problem
  4. DO NOT ask them to repeat it again or show work they already showed
- Example: Student says "x=12. I said that." → You: "You're absolutely right! x=12. Now let's find x+10..."
- This is a CRITICAL signal that you're being redundant - stop and move forward

When student gives wrong answers:
- DO NOT use phrases like "getting warmer", "getting closer", "you're almost there", "getting better"
- DO NOT compare wrong answers to each other
- Instead, redirect to the METHOD: "Let's think about the steps we need to take to solve this..."
- Focus on the PROCESS, not on proximity to the answer
- After 2+ wrong answers, provide a more concrete hint as a question
- Example: Instead of "Subtract 5", ask "What operation would undo adding 5?"
- Never reveal the direct answer, even when giving hints

Language style:
- Use encouraging phrases when student uses CORRECT PROCESS: "Great thinking!", "Excellent reasoning!"
- Encourage systematic problem-solving, not guessing
- If student is guessing random values, redirect: "Instead of guessing, let's work through this step by step..."
- Be patient and supportive
- Celebrate small wins in understanding concepts
- If student gets frustrated, acknowledge it: "I know this can be tricky, let's break it down together."

Format responses in clear, conversational language. Use LaTeX math notation when writing equations (wrap in $ for inline, $$ for display).

Remember: Your success is measured by the student discovering the answer themselves, NOT by you telling them the answer.`;

/**
 * Send message to Socratic math tutor and get response
 * PR-009: Enhanced with function calling for calculator tool
 * @param {Array} conversationHistory - Array of {role, content} messages
 * @param {number} stuckCount - Number of consecutive wrong answers (for hint progression)
 * @returns {Promise<{content: string, success: boolean, error?: string, usedCalculator?: boolean}>}
 */
export async function getSocraticResponse(conversationHistory, stuckCount = 0) {
  try {
    // PR-005: Add hint progression context based on stuck count
    let systemPrompt = SOCRATIC_SYSTEM_PROMPT;

    if (stuckCount >= 3) {
      systemPrompt += `\n\n⚠️ HINT ESCALATION (Stuck Count: ${stuckCount}): Student has struggled with ${stuckCount} consecutive wrong answers. Provide MORE CONCRETE hints while still using questions. Example: Instead of "What operation might help?" try "What operation would undo multiplication by 2?"`;
    } else if (stuckCount >= 2) {
      systemPrompt += `\n\n⚠️ HINT PROGRESSION (Stuck Count: ${stuckCount}): Student has given ${stuckCount} wrong answers. Start providing more specific hints as questions.`;
    }

    // Prepend system message with Socratic prompt (enhanced with hint progression)
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory
    ];

    // PR-009: FIRST API CALL - with calculator tool available and JSON response format
    let response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: messages,
      tools: [CALCULATOR_TOOL],
      tool_choice: "auto", // Let LLM decide when to use calculator
      response_format: { type: "json_object" }, // Require JSON response
      temperature: 0.3, // Lower temperature for more accurate math verification
      max_tokens: 600 // Increased for JSON overhead
    });

    let message = response.choices[0]?.message;
    let usedCalculator = false;

    // PR-009: CHECK FOR TOOL CALLS (calculator usage)
    if (message.tool_calls) {
      usedCalculator = true;
      console.log('🧮 LLM is using calculator to verify math');

      // Execute each tool call
      const toolResults = [];
      for (const toolCall of message.tool_calls) {
        if (toolCall.function.name === "calculate") {
          const args = JSON.parse(toolCall.function.arguments);
          console.log(`  Calculating: ${args.expression}`);

          const calcResult = evaluateMathExpression(args.expression);
          console.log(`  Result:`, calcResult);

          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            content: JSON.stringify(calcResult)
          });
        }
      }

      // PR-009: SECOND API CALL - with tool results and JSON response format
      response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          ...messages,
          message, // Include the assistant's tool call message
          ...toolResults // Add tool results
        ],
        response_format: { type: "json_object" }, // Require JSON response
        temperature: 0.3,
        max_tokens: 600 // Increased for JSON overhead
      });

      message = response.choices[0]?.message;
    }

    const content = message?.content?.trim();

    if (!content) {
      return {
        success: false,
        error: 'No response generated'
      };
    }

    // PR-009: Parse JSON response to extract message and metadata
    try {
      const parsed = JSON.parse(content);

      // Validate the response has required fields
      if (!parsed.message || !parsed.metadata) {
        console.warn('LLM response missing required fields, using raw content');
        return {
          success: true,
          content: content,
          usedCalculator: usedCalculator,
          metadata: null
        };
      }

      return {
        success: true,
        content: parsed.message, // The actual message to display
        metadata: parsed.metadata, // Conversation state metadata
        usedCalculator: usedCalculator
      };
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      // Fallback: return raw content if JSON parsing fails
      return {
        success: true,
        content: content,
        usedCalculator: usedCalculator,
        metadata: null
      };
    }
  } catch (error) {
    console.error('Error getting Socratic response:', error);
    return {
      success: false,
      error: error.message || 'Failed to get response'
    };
  }
}

export default {
  parseImageToText,
  fileToBase64,
  validateImageFile,
  getSocraticResponse
};

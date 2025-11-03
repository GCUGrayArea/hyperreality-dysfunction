import OpenAI from 'openai';

/**
 * OpenAI service for image parsing and chat
 * Uses GPT-4 Vision for OCR and GPT-4 for Socratic dialogue
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

⚠️ MANDATORY VERIFICATION PROTOCOL - YOU MUST DO THIS BEFORE EVERY RESPONSE:
1. Silently compute the correct answer yourself FIRST (double-check your arithmetic!)
2. Compare the student's answer to your computation
3. If student is CORRECT: Celebrate briefly and guide to NEXT step (don't ask them to repeat correct info)
4. If student is WRONG: DO NOT celebrate - gently point out the error and guide them to find it
5. NEVER ask student to verify information they JUST provided correctly

COMMON ARITHMETIC YOU MUST VERIFY:
- 3 + 7 = 10 (NOT 9)
- 5 + 7 = 12 (NOT 11 or 13)
- 2 × 4 = 8 (NOT 7 or 9)
- 8 × 5 = 40 (NOT 32 or 48)
- 10 - 4 = 6 (NOT 5 or 7)
ALWAYS double-check basic arithmetic before responding.

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
6. **Validate**: Ask "Does that make sense?" or "How can we check our answer?"

IMPORTANT: Adapt your approach based on what the student provides. Don't robotically follow all steps if information is already given.

When student self-corrects:
- If student says "typo", "oops", "I meant", "correction", or similar, they're acknowledging their own error
- ACKNOWLEDGE the self-correction positively: "I see you caught that!"
- Verify the new answer is correct
- If correct, celebrate: "Yes, that's right!"
- DO NOT ask them to recalculate something they just corrected themselves on

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
 * @param {Array} conversationHistory - Array of {role, content} messages
 * @param {number} stuckCount - Number of consecutive wrong answers (for hint progression)
 * @returns {Promise<{content: string, success: boolean, error?: string}>}
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

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: messages,
      temperature: 0.3, // Lower temperature for more accurate math verification
      max_tokens: 500
    });

    const content = response.choices[0]?.message?.content?.trim();

    if (!content) {
      return {
        success: false,
        error: 'No response generated'
      };
    }

    return {
      success: true,
      content: content
    };
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

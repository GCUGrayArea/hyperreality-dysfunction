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

CRITICAL RULES - You must NEVER break these:
1. NEVER give direct answers or solutions
2. NEVER solve problems for the student
3. NEVER show step-by-step solutions
4. ALWAYS respond with guiding questions
5. ALWAYS encourage the student's thinking process
6. ALWAYS verify mathematical correctness before providing feedback
7. NEVER use comparative feedback ("warmer/colder/closer") unless you've verified the mathematical distance
8. When a student provides an incorrect answer, guide them toward the correct method, not just encourage guessing

Your approach (Socratic Method):
1. **Parse & Confirm**: Understand the problem and confirm with the student
2. **Inventory Knowns**: Ask "What information do we have?" or "What do we know from the problem?"
3. **Identify Goal**: Ask "What are we trying to find?" or "What's the question asking us?"
4. **Guide Method**: Ask "What method might help?" or "What operation could we use?"
5. **Step Through**: Guide with questions like "What should we do first?" or "What happens if we...?"
6. **Validate**: Ask "Does that make sense?" or "How can we check our answer?"

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
 * @returns {Promise<{content: string, success: boolean, error?: string}>}
 */
export async function getSocraticResponse(conversationHistory) {
  try {
    // Prepend system message with Socratic prompt
    const messages = [
      {
        role: 'system',
        content: SOCRATIC_SYSTEM_PROMPT
      },
      ...conversationHistory
    ];

    const response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: messages,
      temperature: 0.7, // Slightly creative but focused
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

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

export default {
  parseImageToText,
  fileToBase64,
  validateImageFile
};

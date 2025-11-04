/**
 * Vercel Serverless Function: Image Parsing API
 * Proxies image parsing requests to OpenAI Vision
 * Keeps API key secure on server-side
 */

import OpenAI from 'openai';

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const VISION_MODEL = process.env.OPENAI_VISION_MODEL || 'gpt-4o-mini';

/**
 * CORS headers for API responses
 */
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'No image URL provided'
      });
    }

    // Validate image URL format (should be base64 data URL)
    if (!imageUrl.startsWith('data:image/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image format. Must be a base64 data URL.'
      });
    }

    // Call OpenAI Vision API
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
      return res.status(200).json({
        success: false,
        error: 'No text could be extracted from the image'
      });
    }

    return res.status(200).json({
      success: true,
      text: extractedText
    });
  } catch (error) {
    console.error('Error parsing image:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to parse image'
    });
  }
}

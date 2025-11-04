/**
 * Vercel Serverless Function: Chat API
 * Proxies chat requests to OpenAI with calculator tool support
 * Keeps API key secure on server-side
 */

import OpenAI from 'openai';
import { Parser } from 'expr-eval';

// Initialize OpenAI client with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const CHAT_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

/**
 * Calculator tool definition for function calling
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
 * Safe math expression evaluator
 * Mirrors the mathEvaluator.js functionality
 */
function evaluateMathExpression(expression) {
  try {
    const parser = new Parser();
    const result = parser.evaluate(expression);

    return {
      success: true,
      result: result,
      expression: expression
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      expression: expression
    };
  }
}

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
    const { messages, systemPrompt, stuckCount = 0 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Prepare messages with system prompt
    const fullMessages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...messages
    ];

    // First API call with calculator tool
    let response = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages: fullMessages,
      tools: [CALCULATOR_TOOL],
      tool_choice: "auto",
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 600
    });

    let message = response.choices[0]?.message;
    let usedCalculator = false;

    // Handle tool calls (calculator usage)
    if (message.tool_calls) {
      usedCalculator = true;
      console.log('🧮 LLM is using calculator to verify math');

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

      // Second API call with tool results
      response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          ...fullMessages,
          message,
          ...toolResults
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 600
      });

      message = response.choices[0]?.message;
    }

    const content = message?.content?.trim();

    if (!content) {
      return res.status(500).json({
        success: false,
        error: 'No response generated'
      });
    }

    // Parse JSON response
    try {
      const parsed = JSON.parse(content);

      if (!parsed.message || !parsed.metadata) {
        console.warn('LLM response missing required fields');
        return res.status(200).json({
          success: true,
          content: content,
          usedCalculator: usedCalculator,
          metadata: null
        });
      }

      return res.status(200).json({
        success: true,
        content: parsed.message,
        metadata: parsed.metadata,
        usedCalculator: usedCalculator
      });
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return res.status(200).json({
        success: true,
        content: content,
        usedCalculator: usedCalculator,
        metadata: null
      });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to get response'
    });
  }
}

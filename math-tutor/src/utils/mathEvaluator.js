import { Parser } from 'expr-eval';

/**
 * Safely evaluate mathematical expressions without eval()
 * Uses expr-eval library for secure expression parsing
 *
 * @param {string} expression - Math expression like "2 * (3 + 4)" or "5 + 7"
 * @returns {{success: boolean, result?: number, error?: string}}
 */
export function evaluateMathExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return {
      success: false,
      error: 'Invalid expression: must be a non-empty string'
    };
  }

  // Sanitize input - remove potentially dangerous characters
  const sanitized = expression.trim();

  // Block obvious non-math content for security
  const dangerousPatterns = [
    /eval/i,
    /function/i,
    /=>/,
    /\${/,
    /require/i,
    /import/i,
    /document/i,
    /window/i,
    /process/i,
    /__proto__/i,
    /constructor/i
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(sanitized)) {
      return {
        success: false,
        error: 'Expression contains disallowed content'
      };
    }
  }

  try {
    const parser = new Parser();
    const result = parser.evaluate(sanitized);

    // Validate result is a number
    if (typeof result !== 'number' || !isFinite(result)) {
      return {
        success: false,
        error: 'Expression did not evaluate to a valid number'
      };
    }

    return {
      success: true,
      result: result
    };
  } catch (error) {
    return {
      success: false,
      error: `Evaluation error: ${error.message}`
    };
  }
}

/**
 * Check if two numbers are approximately equal (handles floating point errors)
 * @param {number} a
 * @param {number} b
 * @param {number} epsilon - Tolerance (default 0.0001)
 * @returns {boolean}
 */
export function numbersEqual(a, b, epsilon = 0.0001) {
  return Math.abs(a - b) < epsilon;
}

export default {
  evaluateMathExpression,
  numbersEqual
};

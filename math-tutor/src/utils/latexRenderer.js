import katex from 'katex';

/**
 * Parse text content and render LaTeX equations
 * Supports:
 * - Inline math: $...$ or \(...\)
 * - Block math: $$...$$ or \[...\]
 *
 * @param {string} text - Text content potentially containing LaTeX
 * @returns {Array} Array of {type: 'text'|'math', content: string, display: boolean}
 */
export function parseLatex(text) {
  if (!text) return [];

  const parts = [];
  let remaining = text;

  while (remaining.length > 0) {
    // Look for all math delimiter types
    const dollarBlockMatch = remaining.match(/\$\$([\s\S]+?)\$\$/);
    const dollarInlineMatch = remaining.match(/\$(.+?)\$/);
    const parenBlockMatch = remaining.match(/\\\[([\s\S]+?)\\\]/);
    const parenInlineMatch = remaining.match(/\\\((.+?)\\\)/);

    // Find which match comes first
    const matches = [
      { match: dollarBlockMatch, display: true, type: 'dollarBlock' },
      { match: dollarInlineMatch, display: false, type: 'dollarInline' },
      { match: parenBlockMatch, display: true, type: 'parenBlock' },
      { match: parenInlineMatch, display: false, type: 'parenInline' }
    ].filter(m => m.match !== null)
     .map(m => ({
       ...m,
       index: remaining.indexOf(m.match[0])
     }))
     .sort((a, b) => a.index - b.index);

    if (matches.length === 0) {
      // No more math found, add remaining text
      if (remaining.length > 0) {
        parts.push({
          type: 'text',
          content: remaining
        });
      }
      remaining = '';
    } else {
      const firstMatch = matches[0];

      // Add text before the math
      if (firstMatch.index > 0) {
        parts.push({
          type: 'text',
          content: remaining.substring(0, firstMatch.index)
        });
      }

      // Add the math part
      parts.push({
        type: 'math',
        content: firstMatch.match[1].trim(),
        display: firstMatch.display
      });

      // Continue with remaining text after this match
      remaining = remaining.substring(firstMatch.index + firstMatch.match[0].length);
    }
  }

  return parts;
}

/**
 * Render LaTeX to HTML string
 * @param {string} latex - LaTeX expression
 * @param {boolean} displayMode - true for block, false for inline
 * @returns {string} HTML string
 */
export function renderLatex(latex, displayMode = false) {
  try {
    return katex.renderToString(latex, {
      displayMode,
      throwOnError: false, // Don't throw on errors, show error in output
      errorColor: '#cc0000',
      strict: false, // Allow some non-standard LaTeX
      trust: false, // Don't allow \href, \url, etc for security
    });
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    // Fallback: show the raw LaTeX in a styled span
    return `<span class="latex-error" title="LaTeX rendering failed">${escapeHtml(latex)}</span>`;
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

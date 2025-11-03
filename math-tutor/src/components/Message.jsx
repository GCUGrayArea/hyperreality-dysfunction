import styles from '../styles/Message.module.css';
import 'katex/dist/katex.min.css';
import { parseLatex, renderLatex } from '../utils/latexRenderer';

/**
 * Message component - displays a single chat message with LaTeX rendering
 * @param {Object} props
 * @param {string} props.role - 'user' or 'tutor'
 * @param {string} props.content - message text (may contain LaTeX)
 * @param {number} props.timestamp - message timestamp
 */
export default function Message({ role, content, timestamp }) {
  const isUser = role === 'user';

  // Parse content to extract LaTeX and text parts
  const parts = parseLatex(content);

  return (
    <div className={`${styles.message} ${isUser ? styles.user : styles.tutor}`}>
      <div className={styles.messageHeader}>
        <span className={styles.role}>
          {isUser ? 'You' : 'Tutor'}
        </span>
        {timestamp && (
          <span className={styles.timestamp}>
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        )}
      </div>
      <div className={styles.content}>
        {parts.map((part, index) => {
          if (part.type === 'text') {
            // Regular text - preserve whitespace and newlines
            return (
              <span key={index} style={{ whiteSpace: 'pre-wrap' }}>
                {part.content}
              </span>
            );
          } else {
            // Math content - render with KaTeX
            const html = renderLatex(part.content, part.display);
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: html }}
                className={part.display ? styles.mathBlock : styles.mathInline}
              />
            );
          }
        })}
      </div>
    </div>
  );
}

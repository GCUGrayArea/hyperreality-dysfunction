import styles from '../styles/Message.module.css';

/**
 * Message component - displays a single chat message
 * @param {Object} props
 * @param {string} props.role - 'user' or 'tutor'
 * @param {string} props.content - message text
 * @param {number} props.timestamp - message timestamp
 */
export default function Message({ role, content, timestamp }) {
  const isUser = role === 'user';

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
        {content}
      </div>
    </div>
  );
}

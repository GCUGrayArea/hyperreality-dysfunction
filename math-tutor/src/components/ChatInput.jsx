import { useState } from 'react';
import styles from '../styles/ChatInput.module.css';

/**
 * ChatInput component - handles user text input
 * @param {Object} props
 * @param {Function} props.onSendMessage - callback when user sends a message
 * @param {boolean} props.disabled - whether input is disabled (e.g., waiting for response)
 */
export default function ChatInput({ onSendMessage, disabled = false }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
    }
  };

  const handleKeyDown = (e) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className={styles.inputContainer} onSubmit={handleSubmit}>
      <textarea
        className={styles.input}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Waiting for tutor..." : "Type your answer or ask a question..."}
        disabled={disabled}
        rows={1}
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={disabled || !message.trim()}
      >
        Send
      </button>
    </form>
  );
}

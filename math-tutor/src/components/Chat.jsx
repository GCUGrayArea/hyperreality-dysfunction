import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import styles from '../styles/Chat.module.css';

/**
 * Chat component - main chat container
 * Manages message state and handles user interactions
 */
export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'tutor',
      content: 'Hello! I\'m your AI math tutor. I\'ll help guide you through solving math problems using questions and hints. Let\'s get started! What problem would you like to work on today?',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // TODO: This is a placeholder. Will be replaced with actual LLM integration in PR-004
    // For now, simulate a tutor response
    setTimeout(() => {
      const tutorMessage = {
        id: Date.now() + 1,
        role: 'tutor',
        content: 'That\'s interesting! Let me think about that... (This is a placeholder response. Real Socratic dialogue will be implemented in PR-004 when we integrate the LLM.)',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, tutorMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Math Tutor</h1>
        <p className={styles.subtitle}>Socratic Learning Assistant</p>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {isLoading && (
          <div className={styles.loadingIndicator}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
}

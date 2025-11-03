import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';
import ImageUpload from './ImageUpload';
import { getSocraticResponse } from '../services/openai';
import styles from '../styles/Chat.module.css';

/**
 * Chat component - main chat container
 * Manages message state and handles user interactions
 * PR-002: Added image upload integration
 */
export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'tutor',
      content: 'Hello! I\'m your AI math tutor. I\'ll help guide you through solving math problems using questions and hints. You can type a problem below or upload an image of one. Let\'s get started!',
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(true);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setShowImageUpload(false); // Hide upload after first interaction

    // Get Socratic response from LLM
    try {
      // Convert messages to OpenAI format (skip initial tutor greeting for API)
      const conversationHistory = newMessages
        .slice(1) // Skip the initial greeting
        .map(msg => ({
          role: msg.role === 'tutor' ? 'assistant' : 'user',
          content: msg.content
        }));

      const response = await getSocraticResponse(conversationHistory);

      if (response.success) {
        const tutorMessage = {
          id: Date.now() + 1,
          role: 'tutor',
          content: response.content,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tutorMessage]);
      } else {
        // Handle error
        const errorMessage = {
          id: Date.now() + 1,
          role: 'tutor',
          content: `I'm having trouble connecting right now. Please check that your API key is set up correctly. Error: ${response.error}`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'tutor',
        content: 'I encountered an error. Please try again or check your connection.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleParsedText = async (text, imageUrl) => {
    // Add user message with the parsed problem
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: `Here's my problem: ${text}`,
      timestamp: Date.now()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setShowImageUpload(false); // Hide upload after successful parse

    // Get Socratic response from LLM
    try {
      const conversationHistory = newMessages
        .slice(1) // Skip the initial greeting
        .map(msg => ({
          role: msg.role === 'tutor' ? 'assistant' : 'user',
          content: msg.content
        }));

      const response = await getSocraticResponse(conversationHistory);

      if (response.success) {
        const tutorMessage = {
          id: Date.now() + 1,
          role: 'tutor',
          content: response.content,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tutorMessage]);
      } else {
        const errorMessage = {
          id: Date.now() + 1,
          role: 'tutor',
          content: `I'm having trouble connecting right now. Please check that your API key is set up correctly. Error: ${response.error}`,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error in handleParsedText:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'tutor',
        content: 'I encountered an error. Please try again or check your connection.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>AI Math Tutor</h1>
        <p className={styles.subtitle}>Socratic Learning Assistant</p>
      </div>

      {showImageUpload && (
        <div className={styles.imageUploadSection}>
          <ImageUpload onParsedText={handleParsedText} />
          <div className={styles.divider}>
            <span>or type below</span>
          </div>
        </div>
      )}

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

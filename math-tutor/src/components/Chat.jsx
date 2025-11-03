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
  const [lastError, setLastError] = useState(null);
  const [retryPayload, setRetryPayload] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // TODO PR-005: Response evaluation and hint progression
  // const [stuckCount, setStuckCount] = useState(0);

  // TODO PR-006: Problem state tracking
  // const [currentProblem, setCurrentProblem] = useState(null);
  // const [problemStartIndex, setProblemStartIndex] = useState(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content) => {
    // Clear previous errors
    setLastError(null);
    setRetryPayload(null);

    // PR-006: Detect if this is a new problem
    const isNewProblem = detectNewProblem(content);
    if (isNewProblem) {
      setCurrentProblem(content);
      setProblemStartIndex(messages.length); // Index where this problem starts
      setStuckCount(0); // Reset stuck count for new problem
    }

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

      // PR-005: Pass stuck count for hint progression
      const response = await getSocraticResponse(conversationHistory, stuckCount);

      if (response.success) {
        const tutorMessage = {
          id: Date.now() + 1,
          role: 'tutor',
          content: response.content,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tutorMessage]);

        // PR-005: Update stuck count based on tutor response
        if (detectWrongAnswer(response.content)) {
          setStuckCount(prev => prev + 1);
        } else if (detectCorrectAnswer(response.content)) {
          setStuckCount(0); // Reset on correct answer
        }
      } else {
        // Handle error with retry capability
        const errorDetail = getErrorDetails(response.error);
        setLastError(errorDetail);
        setRetryPayload({ type: 'message', data: content });
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      const errorDetail = getErrorDetails(error.message || 'Unknown error');
      setLastError(errorDetail);
      setRetryPayload({ type: 'message', data: content });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * PR-005: Detect if tutor response indicates student was wrong/stuck
   * Looks for correction patterns in tutor's response
   */
  const detectWrongAnswer = (tutorResponse) => {
    const lowerResponse = tutorResponse.toLowerCase();
    const correctionPhrases = [
      'let\'s check',
      'let\'s go back',
      'let\'s take a step back',
      'not quite',
      'that\'s not',
      'doesn\'t equal',
      'doesn\'t match',
      'double-check',
      'try again',
      'hmm',
      'reconsider',
      'look again',
      'look back',
      'careful',
      'actually',
      'incorrect',
      'substitute it back',
      'substitute that back',
      'verify',
      'still trying'
    ];

    return correctionPhrases.some(phrase => lowerResponse.includes(phrase));
  };

  /**
   * PR-005: Detect if tutor response celebrates correct answer
   * Indicates student got it right
   */
  const detectCorrectAnswer = (tutorResponse) => {
    const lowerResponse = tutorResponse.toLowerCase();
    const celebrationPhrases = [
      'excellent',
      'perfect',
      'that\'s right',
      'correct',
      'exactly',
      'well done',
      'great job',
      'nice work'
    ];

    return celebrationPhrases.some(phrase => lowerResponse.includes(phrase));
  };

  /**
   * PR-006: Detect if user message is a new problem vs answer to current problem
   * Heuristics: Contains equation symbols, operations, "solve", "find", etc.
   */
  const detectNewProblem = (userMessage) => {
    const msg = userMessage.trim();

    // Check for mathematical problem indicators first
    const problemIndicators = [
      /solve/i,
      /find/i,
      /what is/i,
      /calculate/i,
      /\d+\s*[+\-*/÷×]\s*\d+/, // arithmetic operations (3 + 7)
      /\d+[a-z]\s*[+\-*/]\s*\d+\s*=/, // algebra with operations (2x + 5 = 13)
      /[a-z]\s*[+\-*/]\s*\d+\s*=\s*\d+/, // algebra (x + 3 = 7)
      /=.*\?/, // equation with question mark
      /area|perimeter|volume/i, // geometry
      /how many/i, // word problems
      /\bif\b.*\bthen\b/i, // conditional problems
    ];

    const hasProblemPattern = problemIndicators.some(pattern => pattern.test(userMessage));

    // If we found a problem pattern, it's a new problem
    if (hasProblemPattern) {
      return true;
    }

    // Otherwise, if it's very short and doesn't have problem keywords, it's likely just an answer
    // Short answers like "x=5", "4", "yes", "subtract 5" should NOT be new problems
    if (msg.length <= 6 && !/solve|find|what|calculate|area|perimeter|how many/i.test(msg)) {
      return false;
    }

    // For mid-length messages without clear problem indicators, default to false
    return false;
  };

  const getErrorDetails = (errorMessage) => {
    if (!errorMessage) {
      return {
        title: 'Connection Error',
        message: 'Unable to connect to the server. Please check your internet connection.',
        recoverable: true
      };
    }

    const lowerError = errorMessage.toLowerCase();

    if (lowerError.includes('api key') || lowerError.includes('unauthorized') || lowerError.includes('401')) {
      return {
        title: 'API Key Error',
        message: 'Your API key is missing or invalid. Please check your .env file and make sure VITE_OPENAI_API_KEY is set correctly.',
        recoverable: false
      };
    } else if (lowerError.includes('rate limit') || lowerError.includes('429')) {
      return {
        title: 'Rate Limit Exceeded',
        message: 'Too many requests. Please wait a moment before trying again.',
        recoverable: true
      };
    } else if (lowerError.includes('network') || lowerError.includes('fetch')) {
      return {
        title: 'Network Error',
        message: 'Unable to reach the server. Please check your internet connection.',
        recoverable: true
      };
    } else if (lowerError.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The request took too long. Please try again.',
        recoverable: true
      };
    } else {
      return {
        title: 'Unexpected Error',
        message: `Something went wrong: ${errorMessage}`,
        recoverable: true
      };
    }
  };

  const handleRetry = () => {
    if (!retryPayload) return;

    if (retryPayload.type === 'message') {
      handleSendMessage(retryPayload.data);
    } else if (retryPayload.type === 'image') {
      handleParsedText(retryPayload.text, retryPayload.imageUrl);
    }
  };

  const handleParsedText = async (text, imageUrl) => {
    // Clear previous errors
    setLastError(null);
    setRetryPayload(null);

    // PR-006: Track new problem from image upload
    setCurrentProblem(text);
    setProblemStartIndex(messages.length); // Index where this problem starts
    setStuckCount(0); // Reset stuck count for new problem

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

      // PR-005: Pass stuck count for hint progression
      const response = await getSocraticResponse(conversationHistory, stuckCount);

      if (response.success) {
        const tutorMessage = {
          id: Date.now() + 1,
          role: 'tutor',
          content: response.content,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, tutorMessage]);

        // PR-005: Update stuck count based on tutor response
        if (detectWrongAnswer(response.content)) {
          setStuckCount(prev => prev + 1);
        } else if (detectCorrectAnswer(response.content)) {
          setStuckCount(0); // Reset on correct answer
        }
      } else {
        // Handle error with retry capability
        const errorDetail = getErrorDetails(response.error);
        setLastError(errorDetail);
        setRetryPayload({ type: 'image', text, imageUrl });
      }
    } catch (error) {
      console.error('Error in handleParsedText:', error);
      const errorDetail = getErrorDetails(error.message || 'Unknown error');
      setLastError(errorDetail);
      setRetryPayload({ type: 'image', text, imageUrl });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer} role="main">
      <header className={styles.header}>
        <h1 className={styles.title}>AI Math Tutor</h1>
        <p className={styles.subtitle}>Socratic Learning Assistant</p>

        {/* PR-006: Current problem indicator */}
        {currentProblem && (
          <div className={styles.currentProblem} role="status" aria-label="Current problem">
            <span className={styles.problemLabel}>Current Problem:</span>{' '}
            <span className={styles.problemText}>{currentProblem}</span>
          </div>
        )}

        {/* PR-005: Hint progression indicator */}
        {stuckCount >= 2 && (
          <div className={styles.hintStatus} role="status" aria-live="polite">
            💡 Hint Level: {stuckCount >= 3 ? 'More Concrete' : 'Progressing'}
          </div>
        )}
      </header>

      {showImageUpload && (
        <div className={styles.imageUploadSection} role="region" aria-label="Problem input options">
          <ImageUpload onParsedText={handleParsedText} />
          <div className={styles.divider}>
            <span>or type below</span>
          </div>
        </div>
      )}

      <div
        className={styles.messagesContainer}
        role="log"
        aria-live="polite"
        aria-label="Conversation history"
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}

        {lastError && (
          <div className={styles.errorMessage} role="alert">
            <h3 className={styles.errorText}>{lastError.title}</h3>
            <p>{lastError.message}</p>
            {lastError.recoverable && retryPayload && (
              <button
                onClick={handleRetry}
                className={styles.retryButton}
                aria-label="Retry failed request"
              >
                Try Again
              </button>
            )}
          </div>
        )}

        {isLoading && (
          <div className={styles.loadingIndicator} aria-label="Tutor is thinking">
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
        ref={inputRef}
      />
    </div>
  );
}

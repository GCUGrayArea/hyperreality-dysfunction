import { useRef, useEffect } from 'react';
import { Excalidraw } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css'; // Required Excalidraw styles
import styles from '../styles/Whiteboard.module.css';

/**
 * Whiteboard component - Interactive canvas for visual problem solving
 * PR-012: Stretch feature for geometry and visual explanations
 *
 * Features:
 * - Drawing tools (pen, shapes, text)
 * - Undo/redo functionality
 * - Clear canvas
 * - State persistence across conversation
 *
 * @param {Object} props
 * @param {Object} props.initialData - Initial Excalidraw scene data (for persistence)
 * @param {Function} props.onChange - Callback when canvas state changes (called on close/unmount)
 * @param {Function} props.onClose - Callback when whiteboard is closed
 */
export default function Whiteboard({ initialData, onChange, onClose }) {
  // Use ref to track current state without causing re-renders
  const currentStateRef = useRef(null);

  // Save state on unmount (handles backdrop click or any other close method)
  useEffect(() => {
    return () => {
      if (onChange && currentStateRef.current) {
        onChange(currentStateRef.current);
      }
    };
  }, [onChange]);

  const handleChange = (elements, appState, files) => {
    // Store state in ref (doesn't trigger re-render)
    currentStateRef.current = {
      elements,
      appState,
      files
    };
  };

  const handleClose = () => {
    // Save state before closing
    if (onChange && currentStateRef.current) {
      onChange(currentStateRef.current);
    }
    onClose();
  };

  return (
    <div className={styles.whiteboardContainer}>
      <div className={styles.whiteboardHeader}>
        <div className={styles.headerContent}>
          <h2 className={styles.whiteboardTitle}>Whiteboard</h2>
          <p className={styles.whiteboardNote}>
            Visual workspace for your problem solving. Ask questions through chat - the tutor cannot read the canvas directly.
          </p>
        </div>
        <button
          onClick={handleClose}
          className={styles.closeButton}
          aria-label="Close whiteboard"
        >
          ✕
        </button>
      </div>

      <div className={styles.whiteboardCanvas}>
        <Excalidraw
          initialData={initialData}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

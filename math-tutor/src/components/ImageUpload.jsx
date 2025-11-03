import { useState, useRef } from 'react';
import { parseImageToText, fileToBase64, validateImageFile } from '../services/openai';
import styles from '../styles/ImageUpload.module.css';

/**
 * ImageUpload component - handles image upload and parsing
 * Supports drag-drop and click-to-upload
 * @param {Object} props
 * @param {Function} props.onParsedText - Callback when text is successfully parsed
 */
export default function ImageUpload({ onParsedText }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [parsedText, setParsedText] = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    // Reset state
    setError(null);
    setParsedText(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    try {
      setIsProcessing(true);

      // Convert to base64 and show preview
      const base64Image = await fileToBase64(file);
      setUploadedImage(base64Image);

      // Parse image with OpenAI Vision
      const result = await parseImageToText(base64Image);

      if (result.success) {
        setParsedText(result.text);
        // Notify parent component
        if (onParsedText) {
          onParsedText(result.text, base64Image);
        }
      } else {
        setError(result.error || 'Failed to parse image');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.message || 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setUploadedImage(null);
    setParsedText(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      {!uploadedImage && (
        <div
          className={`${styles.dropzone} ${isDragging ? styles.dragging : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/gif"
            onChange={handleFileInputChange}
            className={styles.fileInput}
          />

          <div className={styles.dropzoneContent}>
            <svg
              className={styles.uploadIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={styles.dropzoneText}>
              <span className={styles.dropzoneHighlight}>Click to upload</span> or drag and drop
            </p>
            <p className={styles.dropzoneHint}>
              PNG, JPG, WEBP or GIF (max 20MB)
            </p>
          </div>
        </div>
      )}

      {uploadedImage && (
        <div className={styles.previewContainer}>
          <img
            src={uploadedImage}
            alt="Uploaded math problem"
            className={styles.previewImage}
          />
          <button
            onClick={handleReset}
            className={styles.resetButton}
            disabled={isProcessing}
          >
            Upload Different Image
          </button>
        </div>
      )}

      {isProcessing && (
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>Parsing math problem from image...</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <svg
            className={styles.errorIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {parsedText && !isProcessing && (
        <div className={styles.parsedTextContainer}>
          <h3 className={styles.parsedTextTitle}>Extracted Problem:</h3>
          <div className={styles.parsedText}>{parsedText}</div>
          <p className={styles.parsedTextHint}>
            Does this look correct? You can now start solving it below.
          </p>
        </div>
      )}
    </div>
  );
}

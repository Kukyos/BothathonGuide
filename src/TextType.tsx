import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Mocking the GSAP text plugin or using vanilla intervals to ensure it perfectly handles the props
export default function TextType({
  text,
  texts,
  typingSpeed = 75,
  pauseDuration = 1500,
  deletingSpeed = 50,
  showCursor = true,
  cursorCharacter = "_",
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  cursorBlinkDuration = 0.5,
}: {
  text?: string[];
  texts?: string[];
  typingSpeed?: number;
  pauseDuration?: number;
  deletingSpeed?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  variableSpeedEnabled?: boolean;
  variableSpeedMin?: number;
  variableSpeedMax?: number;
  cursorBlinkDuration?: number;
}) {
  const contentArray = texts || text || [];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (contentArray.length === 0) return;

    let timeout: NodeJS.Timeout;

    const currentString = contentArray[currentTextIndex];

    const getTypingSpeed = () => {
      if (variableSpeedEnabled) {
        return Math.floor(Math.random() * (variableSpeedMax - variableSpeedMin + 1)) + variableSpeedMin;
      }
      return typingSpeed;
    };

    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);
    } else if (isDeleting) {
      if (displayedText === '') {
        setIsDeleting(false);
        setCurrentTextIndex((prev) => (prev + 1) % contentArray.length);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText(currentString.substring(0, displayedText.length - 1));
        }, deletingSpeed);
      }
    } else {
      if (displayedText === currentString) {
        setIsPaused(true);
      } else {
        timeout = setTimeout(() => {
          setDisplayedText(currentString.substring(0, displayedText.length + 1));
        }, getTypingSpeed());
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, isDeleting, isPaused, currentTextIndex, contentArray, typingSpeed, deletingSpeed, pauseDuration, variableSpeedEnabled, variableSpeedMin, variableSpeedMax]);

  return (
    <span className="inline-flex items-center">
      {displayedText}
      {showCursor && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: cursorBlinkDuration, ease: "linear" }}
          className="ml-1 inline-block"
        >
          {cursorCharacter}
        </motion.span>
      )}
    </span>
  );
}

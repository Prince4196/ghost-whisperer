import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TerminalTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  showCursor?: boolean;
  onComplete?: () => void;
}

export function TerminalText({ 
  text, 
  className, 
  typingSpeed = 50, 
  showCursor = true,
  onComplete 
}: TerminalTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
        onComplete?.();
      }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [text, typingSpeed, onComplete]);

  return (
    <span className={cn("font-mono", className)}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="inline-block w-2 h-4 bg-primary ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

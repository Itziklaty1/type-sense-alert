
import React, { useState, useEffect } from 'react';
import { Keyboard, Globe, Lock, Unlock } from 'lucide-react';
import { detectLanguage, formatLanguageName } from '../utils/languageDetector';

interface KeyboardStatus {
  capsLock: boolean;
  language: string;
  isTyping: boolean;
  lastInput: string;
}

const KeyboardDetector = () => {
  const [status, setStatus] = useState<KeyboardStatus>({
    capsLock: false,
    language: 'en',
    isTyping: false,
    lastInput: ''
  });

  const [inputBuffer, setInputBuffer] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check caps lock status
      const capsLock = event.getModifierState("CapsLock");
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      // Update typing status
      setStatus(prev => ({
        ...prev,
        capsLock,
        isTyping: true,
        lastInput: event.key
      }));

      // Add to input buffer for language detection
      if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
        setInputBuffer(prev => {
          const newBuffer = (prev + event.key).slice(-100); // Keep last 100 characters
          const detectedLanguage = detectLanguage(newBuffer);
          
          setStatus(current => ({
            ...current,
            language: detectedLanguage,
            capsLock,
            isTyping: true
          }));
          
          return newBuffer;
        });
      }

      // Set timeout to stop typing indicator
      const timeout = setTimeout(() => {
        setStatus(prev => ({ ...prev, isTyping: false }));
      }, 2000);
      
      setTypingTimeout(timeout);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const capsLock = event.getModifierState("CapsLock");
      setStatus(prev => ({ ...prev, capsLock }));
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  return (
    <div className="fixed top-6 right-6 z-50">
      <div 
        className={`
          bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl px-6 py-4 shadow-2xl
          transition-all duration-500 ease-out transform
          ${status.isTyping 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-60 translate-y-2'
          }
        `}
      >
        <div className="flex items-center space-x-4">
          {/* Keyboard Icon */}
          <div className="relative">
            <Keyboard 
              className={`w-6 h-6 transition-colors duration-300 ${
                status.isTyping ? 'text-blue-600' : 'text-gray-500'
              }`} 
            />
            {status.isTyping && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* Language Indicator */}
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-800 min-w-[60px]">
              {formatLanguageName(status.language)}
            </span>
          </div>

          {/* Caps Lock Indicator */}
          <div className="flex items-center space-x-2">
            {status.capsLock ? (
              <Lock className="w-5 h-5 text-orange-500" />
            ) : (
              <Unlock className="w-5 h-5 text-gray-400" />
            )}
            <span 
              className={`text-sm font-medium ${
                status.capsLock ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              {status.capsLock ? 'CAPS' : 'caps'}
            </span>
          </div>
        </div>

        {/* Activity Bar */}
        <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ${
              status.isTyping ? 'w-full' : 'w-0'
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default KeyboardDetector;

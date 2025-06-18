
import React, { useState, useEffect } from 'react';
import { Keyboard, Globe, Lock, Unlock, Settings, X, Volume2, VolumeX } from 'lucide-react';
import { detectLanguage, formatLanguageName } from '../utils/languageDetector';

interface KeyboardStatus {
  capsLock: boolean;
  language: string;
  isTyping: boolean;
  lastInput: string;
}

interface DetectorSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  alwaysOnTop: boolean;
  detectorEnabled: boolean;
  largeMode: boolean;
}

const KeyboardDetector = () => {
  const [status, setStatus] = useState<KeyboardStatus>({
    capsLock: false,
    language: 'en',
    isTyping: false,
    lastInput: ''
  });

  const [settings, setSettings] = useState<DetectorSettings>({
    soundEnabled: true,
    notificationsEnabled: true,
    alwaysOnTop: true,
    detectorEnabled: true,
    largeMode: false
  });

  const [showSettings, setShowSettings] = useState(false);
  const [inputBuffer, setInputBuffer] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastLanguage, setLastLanguage] = useState('en');

  // Audio context for sound notifications
  const playBeep = (frequency: number, duration: number) => {
    if (!settings.soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Desktop notification for language changes
  const showLanguageNotification = (newLanguage: string) => {
    if (!settings.notificationsEnabled) return;
    
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Language Changed', {
        body: `Now typing in ${formatLanguageName(newLanguage)}`,
        icon: '/favicon.ico',
        tag: 'language-change'
      });
    }
  };

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      // Ctrl+Shift+K to toggle detector
      if (event.ctrlKey && event.shiftKey && event.key === 'K') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, detectorEnabled: !prev.detectorEnabled }));
      }
      
      // Ctrl+Shift+L to toggle large mode
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, largeMode: !prev.largeMode }));
      }
      
      // Ctrl+Shift+S to toggle sound
      if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        event.preventDefault();
        setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, []);

  useEffect(() => {
    if (!settings.detectorEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check caps lock status
      const capsLock = event.getModifierState("CapsLock");
      
      // Play sound when caps lock is activated
      if (capsLock && !status.capsLock) {
        playBeep(800, 0.2); // Higher pitch beep for caps lock on
      } else if (!capsLock && status.capsLock) {
        playBeep(400, 0.2); // Lower pitch beep for caps lock off
      }
      
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
          
          // Show notification if language changed
          if (detectedLanguage !== lastLanguage && newBuffer.length > 10) {
            showLanguageNotification(detectedLanguage);
            setLastLanguage(detectedLanguage);
          }
          
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
  }, [typingTimeout, status.capsLock, lastLanguage, settings.detectorEnabled, settings.soundEnabled, settings.notificationsEnabled]);

  if (!settings.detectorEnabled) {
    return (
      <div className="fixed top-6 right-6 z-50">
        <button
          onClick={() => setSettings(prev => ({ ...prev, detectorEnabled: true }))}
          className="bg-gray-400/80 backdrop-blur-lg border border-white/20 rounded-2xl px-4 py-2 shadow-2xl text-white hover:bg-gray-500/80 transition-colors"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const containerSize = settings.largeMode ? 'px-8 py-6' : 'px-6 py-4';
  const iconSize = settings.largeMode ? 'w-8 h-8' : 'w-6 h-6';
  const textSize = settings.largeMode ? 'text-lg' : 'text-base';

  return (
    <div className={`fixed top-6 right-6 ${settings.alwaysOnTop ? 'z-[9999]' : 'z-50'}`}>
      <div 
        className={`
          bg-white/90 backdrop-blur-lg border border-white/30 rounded-2xl ${containerSize} shadow-2xl
          transition-all duration-500 ease-out transform
          ${status.isTyping 
            ? 'scale-100 opacity-100 translate-y-0' 
            : 'scale-95 opacity-70 translate-y-2'
          }
          ${settings.largeMode ? 'min-w-[280px]' : 'min-w-[240px]'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            {/* Keyboard Icon */}
            <div className="relative">
              <Keyboard 
                className={`${iconSize} transition-colors duration-300 ${
                  status.isTyping ? 'text-blue-600' : 'text-gray-500'
                }`} 
              />
              {status.isTyping && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              )}
            </div>

            {/* Language Indicator */}
            <div className="flex items-center space-x-2">
              <Globe className={`${settings.largeMode ? 'w-6 h-6' : 'w-5 h-5'} text-gray-600`} />
              <span className={`font-medium text-gray-800 ${textSize} min-w-[60px]`}>
                {formatLanguageName(status.language)}
              </span>
            </div>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          {/* Caps Lock Indicator */}
          <div className="flex items-center space-x-2">
            {status.capsLock ? (
              <Lock className={`${settings.largeMode ? 'w-6 h-6' : 'w-5 h-5'} text-orange-500`} />
            ) : (
              <Unlock className={`${settings.largeMode ? 'w-6 h-6' : 'w-5 h-5'} text-gray-400`} />
            )}
            <span 
              className={`${settings.largeMode ? 'text-base' : 'text-sm'} font-medium ${
                status.capsLock ? 'text-orange-600' : 'text-gray-500'
              }`}
            >
              {status.capsLock ? 'CAPS' : 'caps'}
            </span>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-green-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
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

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sound notifications</span>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                  className={`w-8 h-4 rounded-full transition-colors ${
                    settings.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                    settings.soundEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Desktop notifications</span>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }))}
                  className={`w-8 h-4 rounded-full transition-colors ${
                    settings.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                    settings.notificationsEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Large mode</span>
                <button
                  onClick={() => setSettings(prev => ({ ...prev, largeMode: !prev.largeMode }))}
                  className={`w-8 h-4 rounded-full transition-colors ${
                    settings.largeMode ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${
                    settings.largeMode ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Ctrl+Shift+K: Toggle detector</div>
                <div>Ctrl+Shift+L: Toggle large mode</div>
                <div>Ctrl+Shift+S: Toggle sound</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyboardDetector;

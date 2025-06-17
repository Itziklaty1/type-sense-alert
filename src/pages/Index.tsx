
import React from 'react';
import KeyboardDetector from '../components/KeyboardDetector';
import LanguageStats from '../components/LanguageStats';
import TestingArea from '../components/TestingArea';
import { Keyboard, Zap, Globe } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Keyboard Detector - Always visible */}
      <KeyboardDetector />
      
      {/* Header */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <Keyboard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Keyboard Language Detector
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real-time detection of your typing language and caps lock status. 
            Start typing anywhere to see the magic happen!
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-time Detection</h3>
            <p className="text-gray-600 text-sm">
              Instantly detects language changes as you type with advanced pattern recognition
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Multi-language Support</h3>
            <p className="text-gray-600 text-sm">
              Supports 10+ languages including English, Spanish, French, German, and more
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Keyboard className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Caps Lock Monitor</h3>
            <p className="text-gray-600 text-sm">
              Never accidentally type in caps again with our visual caps lock indicator
            </p>
          </div>
        </div>

        {/* Testing Area */}
        <div className="mb-8">
          <TestingArea />
        </div>

        {/* Language Statistics */}
        <LanguageStats />

        {/* Instructions */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">How to Use</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="text-3xl mb-2">⌨️</div>
              <h3 className="font-semibold mb-2">Step 1: Type</h3>
              <p className="opacity-90">Start typing in any language anywhere on the page</p>
            </div>
            <div>
              <div className="text-3xl mb-2">👀</div>
              <h3 className="font-semibold mb-2">Step 2: Watch</h3>
              <p className="opacity-90">The floating notification will appear in the top-right corner</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Step 3: Monitor</h3>
              <p className="opacity-90">See real-time language and caps lock status updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

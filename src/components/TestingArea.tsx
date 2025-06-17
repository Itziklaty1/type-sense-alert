
import React, { useState } from 'react';
import { Type, RefreshCcw } from 'lucide-react';

const TestingArea = () => {
  const [testText, setTestText] = useState('');

  const sampleTexts = [
    { lang: 'English', text: 'Hello world! This is a sample text in English.' },
    { lang: 'Spanish', text: 'Hola mundo! Este es un texto de ejemplo en español.' },
    { lang: 'French', text: 'Bonjour le monde! Ceci est un exemple de texte en français.' },
    { lang: 'German', text: 'Hallo Welt! Dies ist ein Beispieltext auf Deutsch.' },
    { lang: 'Italian', text: 'Ciao mondo! Questo è un testo di esempio in italiano.' },
    { lang: 'Portuguese', text: 'Olá mundo! Este é um texto de exemplo em português.' },
    { lang: 'Russian', text: 'Привет мир! Это пример текста на русском языке.' },
    { lang: 'Chinese', text: '你好世界！这是中文示例文本。' },
    { lang: 'Japanese', text: 'こんにちは世界！これは日本語のサンプルテキストです。' },
    { lang: 'Arabic', text: 'مرحبا بالعالم! هذا نص تجريبي باللغة العربية.' }
  ];

  const handleSampleText = (text: string) => {
    setTestText(text);
  };

  const clearText = () => {
    setTestText('');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Type className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Test the Detector</h3>
        </div>
        <button
          onClick={clearText}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>

      <textarea
        value={testText}
        onChange={(e) => setTestText(e.target.value)}
        placeholder="Start typing here to test language detection and caps lock status..."
        className="w-full h-32 p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Try sample texts:</h4>
        <div className="flex flex-wrap gap-2">
          {sampleTexts.map((sample, index) => (
            <button
              key={index}
              onClick={() => handleSampleText(sample.text)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {sample.lang}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestingArea;

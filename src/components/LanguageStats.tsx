
import React from 'react';
import { BarChart3, Globe } from 'lucide-react';
import { getSupportedLanguages } from '../utils/languageDetector';

const LanguageStats = () => {
  const supportedLanguages = getSupportedLanguages();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center space-x-3 mb-4">
        <BarChart3 className="w-6 h-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-800">Supported Languages</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {supportedLanguages.map((language) => (
          <div 
            key={language.code}
            className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Globe className="w-4 h-4 text-gray-500" />
            <div>
              <div className="font-medium text-gray-800 text-sm">
                {language.name}
              </div>
              <div className="text-xs text-gray-500 uppercase">
                {language.code}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageStats;

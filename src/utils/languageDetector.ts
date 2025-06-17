
// Language detection utility based on character patterns and unicode ranges

interface LanguagePattern {
  code: string;
  name: string;
  unicodeRanges: Array<[number, number]>;
  commonPatterns: string[];
  commonWords: string[];
}

const languagePatterns: LanguagePattern[] = [
  {
    code: 'en',
    name: 'English',
    unicodeRanges: [[65, 90], [97, 122]], // A-Z, a-z
    commonPatterns: ['th', 'he', 'in', 'er', 'an', 'ed', 'nd', 'to', 'en', 'ti'],
    commonWords: ['the', 'and', 'you', 'that', 'was', 'for', 'are', 'with', 'his', 'they']
  },
  {
    code: 'es',
    name: 'Spanish',
    unicodeRanges: [[65, 90], [97, 122], [192, 255]], // A-Z, a-z, accented
    commonPatterns: ['ión', 'ado', 'eda', 'que', 'con', 'ent', 'est', 'par', 'ero', 'ada'],
    commonWords: ['que', 'una', 'con', 'para', 'los', 'del', 'las', 'por', 'son', 'sus']
  },
  {
    code: 'fr',
    name: 'French',
    unicodeRanges: [[65, 90], [97, 122], [192, 255]], // A-Z, a-z, accented
    commonPatterns: ['ent', 'tion', 'ait', 'que', 'les', 'eur', 'ant', 'lle', 'ment', 'ait'],
    commonWords: ['que', 'les', 'des', 'une', 'pour', 'avec', 'son', 'sur', 'tout', 'par']
  },
  {
    code: 'de',
    name: 'German',
    unicodeRanges: [[65, 90], [97, 122], [196, 196], [214, 214], [220, 220], [228, 228], [246, 246], [252, 252], [223, 223]], // A-Z, a-z, ÄÖÜäöüß
    commonPatterns: ['der', 'die', 'und', 'ich', 'ist', 'das', 'sie', 'den', 'mit', 'ein'],
    commonWords: ['der', 'die', 'und', 'ich', 'ist', 'das', 'sie', 'den', 'mit', 'ein']
  },
  {
    code: 'it',
    name: 'Italian',
    unicodeRanges: [[65, 90], [97, 122], [192, 255]], // A-Z, a-z, accented
    commonPatterns: ['ino', 'ato', 'nte', 'che', 'con', 'per', 'una', 'del', 'ell', 'ess'],
    commonWords: ['che', 'una', 'con', 'per', 'del', 'gli', 'dalla', 'alla', 'sono', 'come']
  },
  {
    code: 'pt',
    name: 'Portuguese',
    unicodeRanges: [[65, 90], [97, 122], [192, 255]], // A-Z, a-z, accented
    commonPatterns: ['ção', 'ado', 'que', 'com', 'por', 'para', 'uma', 'dos', 'ent', 'est'],
    commonWords: ['que', 'uma', 'com', 'para', 'dos', 'por', 'são', 'sua', 'como', 'pela']
  },
  {
    code: 'ru',
    name: 'Russian',
    unicodeRanges: [[1040, 1103]], // Cyrillic
    commonPatterns: ['ов', 'ен', 'ст', 'то', 'на', 'не', 'от', 'ко', 'но', 'по'],
    commonWords: ['что', 'это', 'как', 'его', 'она', 'так', 'все', 'она', 'был', 'том']
  },
  {
    code: 'zh',
    name: 'Chinese',
    unicodeRanges: [[19968, 40959], [13312, 19903]], // CJK Unified Ideographs
    commonPatterns: ['的', '一', '是', '在', '不', '了', '有', '和', '人', '这'],
    commonWords: ['的', '一', '是', '在', '不', '了', '有', '和', '人', '这']
  },
  {
    code: 'ja',
    name: 'Japanese',
    unicodeRanges: [[12352, 12447], [12448, 12543], [19968, 40959]], // Hiragana, Katakana, Kanji
    commonPatterns: ['の', 'に', 'は', 'を', 'と', 'が', 'で', 'て', 'た', 'し'],
    commonWords: ['の', 'に', 'は', 'を', 'と', 'が', 'で', 'て', 'た', 'し']
  },
  {
    code: 'ar',
    name: 'Arabic',
    unicodeRanges: [[1536, 1791]], // Arabic
    commonPatterns: ['ال', 'في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'التي', 'الذي', 'أن'],
    commonWords: ['في', 'من', 'إلى', 'على', 'هذا', 'هذه', 'التي', 'الذي', 'أن', 'كان']
  }
];

export const detectLanguage = (text: string): string => {
  if (!text || text.length < 3) return 'en';

  const scores: Record<string, number> = {};
  
  // Initialize scores
  languagePatterns.forEach(lang => {
    scores[lang.code] = 0;
  });

  // Score based on unicode ranges
  for (const char of text) {
    const charCode = char.charCodeAt(0);
    
    languagePatterns.forEach(lang => {
      for (const [start, end] of lang.unicodeRanges) {
        if (charCode >= start && charCode <= end) {
          scores[lang.code] += 2;
          break;
        }
      }
    });
  }

  // Score based on common patterns
  const lowerText = text.toLowerCase();
  languagePatterns.forEach(lang => {
    lang.commonPatterns.forEach(pattern => {
      const matches = (lowerText.match(new RegExp(pattern, 'g')) || []).length;
      scores[lang.code] += matches * 3;
    });
    
    lang.commonWords.forEach(word => {
      const matches = (lowerText.match(new RegExp(`\\b${word}\\b`, 'g')) || []).length;
      scores[lang.code] += matches * 5;
    });
  });

  // Find language with highest score
  let maxScore = 0;
  let detectedLanguage = 'en';
  
  Object.entries(scores).forEach(([lang, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedLanguage = lang;
    }
  });

  return detectedLanguage;
};

export const formatLanguageName = (languageCode: string): string => {
  const language = languagePatterns.find(lang => lang.code === languageCode);
  return language?.name || 'English';
};

export const getSupportedLanguages = (): LanguagePattern[] => {
  return languagePatterns;
};

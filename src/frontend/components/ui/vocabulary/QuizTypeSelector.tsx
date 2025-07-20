import { useState } from 'react';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

type QuestionType = 'hebrew-to-english' | 'english-to-hebrew' | 'definition-to-hebrew' | 'example-to-hebrew';

type QuizTypeSelectorProps = {
  onStart: (selectedTypes: QuestionType[]) => void;
  onClose: () => void;
};

export default function QuizTypeSelector({ onStart, onClose }: QuizTypeSelectorProps) {
  const { t } = useLanguage();
  
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([
    'hebrew-to-english',
    'english-to-hebrew',
    'definition-to-hebrew',
    'example-to-hebrew'
  ]);

  const questionTypes: { type: QuestionType; label: string; description: string; emoji: string }[] = [
    {
      type: 'hebrew-to-english',
      label: t('pages.vocabulary.quiz.prompt.hebrewToEnglish') || 'Hebrew to English',
      description: t('pages.vocabulary.quiz.types.hebrewToEnglishDesc') || 'Translate Hebrew words to English',
      emoji: '🇮🇱➡️🇬🇧'
    },
    {
      type: 'english-to-hebrew',
      label: t('pages.vocabulary.quiz.prompt.englishToHebrew') || 'English to Hebrew',
      description: t('pages.vocabulary.quiz.types.englishToHebrewDesc') || 'Translate English words to Hebrew',
      emoji: '🇬🇧➡️🇮🇱'
    },
    {
      type: 'definition-to-hebrew',
      label: t('pages.vocabulary.quiz.prompt.definitionToHebrew') || 'Definition to Hebrew',
      description: t('pages.vocabulary.quiz.types.definitionToHebrewDesc') || 'Match definitions to Hebrew words',
      emoji: '📖➡️🇮🇱'
    },
    {
      type: 'example-to-hebrew',
      label: t('pages.vocabulary.quiz.prompt.exampleToHebrew') || 'Example to Hebrew',
      description: t('pages.vocabulary.quiz.types.exampleToHebrewDesc') || 'Match examples to Hebrew words',
      emoji: '💬➡️🇮🇱'
    }
  ];

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const selectAll = () => {
    setSelectedTypes(['hebrew-to-english', 'english-to-hebrew', 'definition-to-hebrew', 'example-to-hebrew']);
  };

  const selectNone = () => {
    setSelectedTypes([]);
  };

  const handleStart = () => {
    // Always use selected types, if none selected it will use all types by default
    onStart(selectedTypes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-6 relative border-4 border-emerald-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label={t('pages.vocabulary.close') || 'Close'}
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3">🎯</div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">
            {t('pages.vocabulary.quiz.selectTypes') || 'Select Question Types'}
          </h2>
        </div>



        {/* Question type options */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {questionTypes.map(({ type, label, emoji }) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`p-3 rounded-xl border-2 transition-all duration-200 text-center hover:scale-105 ${
                selectedTypes.includes(type)
                  ? 'bg-emerald-100 border-emerald-400 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <div className={`font-semibold text-sm ${
                selectedTypes.includes(type) ? 'text-emerald-700' : 'text-gray-700'
              }`}>
                {label}
              </div>
            </button>
          ))}
        </div>

        {/* Start button */}
        <div className="flex justify-center">
          <button
            onClick={handleStart}
            className="px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg bg-gradient-to-r from-emerald-400 to-emerald-600 text-white hover:scale-105"
          >
            🚀 {t('pages.vocabulary.quiz.startQuiz') || 'Start Quiz'}
          </button>
        </div>
      </div>
    </div>
  );
} 
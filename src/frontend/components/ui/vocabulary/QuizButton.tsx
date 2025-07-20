import { useLanguage } from '@/frontend/contexts/LanguageContext';

type QuizButtonProps = {
  onClick: () => void;
  wordCount: number;
  disabled?: boolean;
};

export default function QuizButton({ onClick, wordCount, disabled = false }: QuizButtonProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-3 mb-8">
      <button
        className={`
          relative group px-8 py-4 rounded-2xl text-xl font-bold text-white
          bg-gradient-to-r from-emerald-500 to-emerald-600 
          hover:from-emerald-600 hover:to-emerald-700
          transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          shadow-lg
        `}
        onClick={onClick}
        disabled={disabled || wordCount === 0}
        data-testid="start-quiz-btn"
      >
        {/* Background glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
        
        {/* Button content */}
        <div className="relative flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <span>{t('pages.vocabulary.quiz.start') || 'Start Quiz'}</span>
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </div>
      </button>
      
    </div>
  );
} 
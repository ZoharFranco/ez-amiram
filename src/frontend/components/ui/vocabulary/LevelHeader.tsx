import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { FaCheckCircle } from 'react-icons/fa';
import { TimerIcon } from 'lucide-react';

type LevelHeaderProps = {
  level: number;
  wordCount: number;
  learnedCount: number;
  learningCount?: number; // Optional for backward compatibility
};

export default function LevelHeader({ level, wordCount, learnedCount, learningCount = 0 }: LevelHeaderProps) {
  const { t } = useLanguage();
  const progress = wordCount > 0 ? (learnedCount / wordCount) * 100 : 0;
  const learningProgress = wordCount > 0 ? (learningCount / wordCount) * 100 : 0;


  // Calculate the width for learned and learning so they are adjacent, both from the left
  // The learned bar is first, then the learning bar, then the rest is gray
  // If learned + learning > 100%, cap at 100%
  const learnedWidth = Math.min(progress, 100);
  const learningWidth = Math.min(Math.max(learningProgress, 0), 100 - learnedWidth);

  return (
    <div className="text-center mb-8 animate-slide-in">
      {/* Level Title */}
      <h1 className="text-6xl font-bold mb-6 animate-fade-in-scale" style={{ animationDelay: '0.1s' }}>
        {t('pages.vocabulary.level') || 'Level'} {level}
      </h1>

      {/* Progress Info */}
      <div className="flex justify-center items-center gap-6 text-gray-700 mb-4 animate-fade-in-scale" style={{ animationDelay: '0.2s' }}>
        {/* Learned */}
        <span className="flex items-center gap-2 text-lg">
          <FaCheckCircle className="text-emerald-400 w-5 h-5" aria-label="Learned" />
          {learnedCount} / {wordCount} {t('pages.vocabulary.words') || 'words'}
        </span>
        {/* Progress Percentage */}
        <span className="text-lg font-semibold text-emerald-600">
          {Math.ceil(progress)}%
        </span>
        {/* Learning */}
        <span className="flex items-center gap-2 text-lg">
          <TimerIcon className="text-blue-400 w-5 h-5" aria-label="Learning" />
          <span className="font-bold">{learningCount}</span> {t('pages.vocabulary.status.learning') || 'learning'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto animate-fade-in-scale" style={{ animationDelay: '0.3s' }}>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden flex relative">
          {/* Learned Progress (emerald, from left) */}
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
            style={{
              width: `${learnedWidth}%`,
              borderTopRightRadius: '0.75rem',
              borderBottomRightRadius: '0.75rem'
            }}
          />
          {/* Learning Progress (blue, immediately after learned, from left) */}
          {learningCount > 0 && learningWidth > 0 && (
            <div
              className="h-full bg-blue-400/70 transition-all duration-500"
              style={{
                width: `${learningWidth}%`,
                marginLeft: `${learnedWidth}%`,
                borderTopRightRadius: learnedWidth + learningWidth === 100 ? '0.75rem' : 0,
                borderBottomRightRadius: learnedWidth + learningWidth === 100 ? '0.75rem' : 0,
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
} 
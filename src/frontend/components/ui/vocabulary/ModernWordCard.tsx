import { VocabularyWord, WordStatus } from '@/config/content/vocabulary/vocabulary';
import { TimerIcon } from 'lucide-react';
import { FaRegCircle, FaCheckCircle } from 'react-icons/fa';

type ModernWordCardProps = {
  word: VocabularyWord;
  onClick: () => void;
  onStatusIconClick?: () => void; // NEW PROP
};

// Bigger icon size, but still responsive for phone
const ICON_SIZE_CLASSES =
  'w-5 h-5 sm:w-7 sm:h-7 mr-2 sm:mr-3';


function getStatusIcon(status: WordStatus | undefined) {
  switch (status) {
    case 'learned':
      return <FaCheckCircle className={`text-emerald-400 ${ICON_SIZE_CLASSES}`} aria-label="Learned" />;
    case 'learning':
      return <TimerIcon className={`text-blue-400 ${ICON_SIZE_CLASSES}`} aria-label="Learning" />;
    case 'toLearn':
    default:
      return <FaRegCircle className={`text-gray-300 ${ICON_SIZE_CLASSES}`} aria-label="To Learn" />;
  }
}

function getBorderColor(status: WordStatus | undefined) {
  return status === 'learned' ? 'border-emerald-400' : 'border-gray-200';
}

export default function ModernWordCard({ word, onClick, onStatusIconClick }: ModernWordCardProps) {
  const status = word.status || 'toLearn';
  const borderColor = getBorderColor(status);

  // Progress bar: show learned and learning
  const progress =
    status === 'learned'
      ? 100
      : status === 'learning'
        ? 50
        : 0;

  return (
    <button
      type="button"
      className={`
        w-full text-left flex items-center gap-2 sm:gap-5 px-3 py-2 sm:px-4 sm:py-5
        rounded-2xl border ${borderColor} bg-white
        hover:bg-gray-50 active:bg-gray-100
        transition-colors duration-200
        shadow-md
        focus:outline-none focus:ring-2 focus:ring-emerald-300
        cursor-pointer
      `}
      onClick={onClick}
      tabIndex={0}
      aria-label={`${word.word} - ${word.hebrewTranslation}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Status Icon */}
      <span className="flex items-center justify-center flex-shrink-0">
        <button
          type="button"
          className="focus:outline-none bg-transparent border-none p-0 m-0 cursor-pointer"
          tabIndex={-1}
          aria-label="Change word status"
          onClick={e => {
            e.stopPropagation();
            if (onStatusIconClick) {
              onStatusIconClick();
            }
          }}
        >
          {getStatusIcon(status)}
        </button>
      </span>
      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex flex-row items-center gap-1 sm:gap-3 justify-end">
          <span
            className="text-xs sm:text-lg md:text-xl lg:text-2xl text-gray-500 truncate ml-1 sm:ml-2 max-w-[6em] sm:max-w-[10em]"
            title={word.hebrewTranslation}
          >
            {word.hebrewTranslation}
          </span>
          <span className="font-bold text-base sm:text-2xl md:text-3xl text-gray-900">{word.word}</span>
        </div>
        {/* Progress bar for learned and learning */}
        <div className="w-full h-2 sm:h-3 bg-gray-200 rounded-full mt-1 sm:mt-3">
          <div
            className={`
              h-2 sm:h-3 rounded-full transition-all duration-500
              ${status === 'learned'
                ? 'bg-emerald-400'
                : status === 'learning'
                  ? 'bg-blue-400'
                  : 'bg-gray-300'}
            `}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </button>
  );
}
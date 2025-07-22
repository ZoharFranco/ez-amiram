import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { FaBookOpen, FaCheckCircle } from 'react-icons/fa';
import { TimerIcon } from 'lucide-react';

type LevelHeaderProps = {
  level: number;
  wordCount: number;
  learnedCount: number;
  learningCount?: number;
};

export default function LevelHeader({
  level,
  wordCount,
  learnedCount,
  learningCount = 0
}: LevelHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center mb-6" dir={t('dir') === 'rtl' ? 'rtl' : 'ltr'}>
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-8">
        {t('pages.vocabulary.level')} {level}
      </h1>
      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-10">
        {/* Total Words */}
        <div className="flex flex-col items-center justify-center p-4 bg-white/50 border border-gray-200/80 rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <FaBookOpen className="w-8 h-8 text-gray-600 mb-2" />
          <span className="text-2xl font-bold text-gray-800 tracking-tight">
            {wordCount}
          </span>
          <span className="text-sm font-semibold text-gray-500 uppercase">
            {t('pages.vocabulary.status.total')}
          </span>
        </div>

        {/* Learning */}
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50/50 border border-blue-200/80 rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <TimerIcon className="w-8 h-8 text-blue-500 mb-2" />
          <span className="text-2xl font-bold text-blue-800 tracking-tight">
            {learningCount}
          </span>
          <span className="text-sm font-semibold text-blue-600 uppercase">
            {t('pages.vocabulary.status.learning')}
          </span>
        </div>

        {/* Learned */}
        <div className="flex flex-col items-center justify-center p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl shadow-lg backdrop-blur-sm transition-all hover:shadow-xl hover:-translate-y-1">
          <FaCheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
          <span className="text-2xl font-bold text-emerald-800 tracking-tight">
            {learnedCount}
          </span>
          <span className="text-sm font-semibold text-emerald-600 uppercase">
            {t('pages.vocabulary.status.learned')}
          </span>
        </div>
      </div>
    </div>
  );
} 
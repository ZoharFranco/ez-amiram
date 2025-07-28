import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { FaCheckCircle, FaClock } from 'react-icons/fa';

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
    <div className="text-center mb-1">
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mr-4 ml-4">
        {t('pages.vocabulary.level')} {level} <span className="text-2xl text-gray-500 font-normal">({wordCount} {t('pages.vocabulary.words')})</span>
      </h1>
      <div className="flex justify-center gap-6 max-w-md mx-auto mb-10 mt-10">
        {/* Learning */}
        <div className="flex flex-col items-center bg-blue-50 border border-blue-100 rounded-xl p-3 shadow-sm w-36 justify-center">
          <div className="flex items-center justify-center mb-2">
            <FaClock className="w-7 h-7 text-blue-500 ml-2" />
            <span className="text-2xl text-blue-600">{t('pages.vocabulary.status.learning')}</span>
          </div>
          <span className="text-2xl font-bold text-blue-800">{learningCount}</span>
        </div>
        {/* Learned */}
        <div className="flex flex-col items-center bg-emerald-50 border border-emerald-100 rounded-xl p-3 shadow-sm w-36">
          <div className="flex items-center justify-center mb-2">
            <FaCheckCircle className="w-7 h-7 text-emerald-500 ml-2" />
            <span className="text-2xl text-emerald-600">{t('pages.vocabulary.status.learned')}</span>
          </div>
          <span className="text-2xl font-bold text-emerald-800">{learnedCount}</span>
        </div>
      </div>
    </div>
  );
} 
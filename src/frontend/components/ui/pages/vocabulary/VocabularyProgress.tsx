import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import ProgressBar from '../../../shared/progressBar';
import ActionButton from '@/frontend/components/shared/ActionButton';

// Mocked vocabulary data (should be replaced with real data source)
const allSubItems = [
  { text: 'אבל', category: 'קישור', level: 'Level A', completed: true },
  { text: 'וגם', category: 'קישור', level: 'Level A', completed: false },
  { text: 'כי', category: 'קישור', level: 'Level A', completed: true },
  { text: 'שם1', category: 'שם', level: 'Level A', completed: true },
  { text: 'שם2', category: 'שם', level: 'Level A', completed: true },
  { text: 'תואר1', category: 'תואר', level: 'Level B', completed: false },
  { text: 'פועל1', category: 'פועל', level: 'Level B', completed: true },
  { text: 'צורה1', category: 'צורה', level: 'Level C', completed: false },
  { text: 'תחילית א', category: 'תחילית', level: 'Level C', completed: true },
];

export default function VocabularyProgress() {
    const router = useRouter();
  const { t } = useLanguage();
  const total = allSubItems.length;
  const completed = allSubItems.filter((i) => i.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const handleVocabularyClick = () => {
        router.push('/frontend/vocabulary');
    };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto py-2 sm:py-4 space-y-2">
        <ProgressBar percent={percent} completed={completed} total={total} className="h-26 sm:h-34" />
      <ActionButton
        className="mt-8 text-2xl px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        onClick={handleVocabularyClick}
      >
        {t('pages.home.vocabularyPractice')}
      </ActionButton>
    </div>
  );
} 
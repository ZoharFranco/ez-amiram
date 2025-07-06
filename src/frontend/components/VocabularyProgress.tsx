import { useLanguage } from '@/frontend/contexts/LanguageContext';
import ProgressBar from './shared/progressBar';

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
  const { t } = useLanguage();
  const total = allSubItems.length;
  const completed = allSubItems.filter((i) => i.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="flex flex-col items-center justify-center">
      <ProgressBar percent={percent} completed={completed} total={total} />
    </div>
  );
} 
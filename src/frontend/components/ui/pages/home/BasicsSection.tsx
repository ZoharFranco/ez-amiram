import VocabularyProgress from '@/frontend/components/ui/pages/vocabulary/VocabularyProgress';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function BasicsSection() {
    const { t } = useLanguage();
  return (
      <section className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto rounded-2xl bg-white border border-gray-200 shadow-sm p-8 sm:p-12 flex flex-col items-center space-y-8 sm:space-y-10 min-h-[400px] sm:min-h-[520px] text-center">
          <h2 className="text-3xl sm:text-4xl mb-8 font-bold">{t('pages.home.vocabularyProgress')}</h2>
      <VocabularyProgress />
    </section>
  );
} 
import VocabularyProgress from '@/frontend/components/ui/pages/vocabulary/VocabularyProgress';
import { useLanguage } from '../../../../contexts/LanguageContext';

export default function BasicsSection() {
    const { t } = useLanguage();
  return (
      <section className="card p-10 mt-8 text-center">
          <h2 className="text-2xl mb-6">{t('pages.home.vocabularyProgress')}</h2>
      <VocabularyProgress />
    </section>
  );
} 
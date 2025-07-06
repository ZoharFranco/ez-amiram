import VocabularyProgress from '@/frontend/components/VocabularyProgress';
import { useLanguage } from '../contexts/LanguageContext';

export default function BasicsSection() {
    const { t } = useLanguage();
  return (
    <section className="card p-10 mt-8">
      <h2 className="text-4xl mb-6">{t('pages.home.vocabularyProgress')}</h2>
      <VocabularyProgress />
    </section>
  );
} 
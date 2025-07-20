import { useLanguage } from '@/frontend/contexts/LanguageContext';

type BackButtonProps = {
  onClick: () => void;
};

export default function BackButton({ onClick }: BackButtonProps) {
  const { t } = useLanguage();

  return (
    <button
      onClick={onClick}
      className="
        flex items-center gap-2 text-emerald-600 hover:text-emerald-700 
        font-semibold transition-colors duration-200
        hover:underline
      "
    >
      <span className="text-xl">→</span>
      <span>{t('pages.vocabulary.back') || 'Back'}</span>
    </button>
  );
} 
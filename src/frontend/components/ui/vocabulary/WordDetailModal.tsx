  import { VocabularyWord, WordStatus } from '@/lib/types/vocabulary';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

type WordDetailModalProps = {
  item: VocabularyWord;
  onClose: () => void;
  onStatusChange: (status: WordStatus) => void;
};

export default function WordDetailModal({ item, onClose }: WordDetailModalProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full mx-2 sm:mx-4 p-0 relative border border-gray-100 overflow-hidden">
        {/* Top Bar */}
        <div className="relative flex items-center px-4 sm:px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-blue-50">
          {/* Close Button */}
          <button
            className="absolute right-2 top-2 text-gray-400 hover:text-gray-700 text-2xl w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
            onClick={onClose}
            aria-label={t('pages.vocabulary.close') || 'Close'}
            tabIndex={0}
          >
            ×
          </button>
          {/* Title */}
          <div className="flex flex-col w-full items-center">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 w-full justify-center">
              <span
                className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight break-words text-center"
                dir="ltr"
                style={{ wordBreak: 'break-word', maxWidth: '100%' }}
                title={item.word}
              >
                {item.word} = {item.hebrewTranslation}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="px-4 sm:px-6 py-7 space-y-6">
          {/* Definition */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 text-emerald-500 text-2xl">📖</span>
            <div>
              <span className="font-semibold text-gray-700 block mb-1 text-base">
                {t('pages.vocabulary.definition') || 'Definition'}
              </span>
              <div className="text-gray-600 leading-relaxed text-left text-lg" dir="ltr">
                {item.definition}
              </div>
            </div>
          </div>

          {/* Example */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 text-blue-400 text-2xl">💡</span>
            <div>
              <span className="font-semibold text-gray-700 block mb-1 text-base">
                {t('pages.vocabulary.example') || 'Example'}
              </span>
              <div className="text-gray-600 italic leading-relaxed text-left text-lg" dir="ltr">
                {item.example.split(new RegExp(`(${item.word})`, 'gi')).map((part, idx) =>
                  part.toLowerCase() === item.word.toLowerCase() ? (
                    <b key={idx} className="font-bold bg-emerald-100 px-1 rounded">{part}</b>
                  ) : (
                    <span key={idx}>{part}</span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
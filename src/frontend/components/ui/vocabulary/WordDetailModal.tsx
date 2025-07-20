import { VocabularyWord, WordStatus } from '@/config/content/vocabulary/vocabulary';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

type WordDetailModalProps = {
  item: VocabularyWord;
  onClose: () => void;
  onStatusChange: (status: WordStatus) => void;
};

export default function WordDetailModal({ item, onClose, onStatusChange }: WordDetailModalProps) {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 p-8 relative border border-gray-200">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          onClick={onClose}
          aria-label={t('pages.vocabulary.close') || 'Close'}
        >
          ×
        </button>
        
        {/* English Word as main title */}
        <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold text-emerald-700 mb-2 tracking-wide">
            {item.word}
          </h2>
          <div className="text-2xl text-gray-700 font-semibold">
            {item.hebrewTranslation}
          </div>
        </div>
        
        {/* Details Grid */}
        <div className="space-y-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-emerald-600 text-lg">📖</span>
              <div>
                <span className="font-semibold text-gray-700 block mb-1">
                  {t('pages.vocabulary.definition') || 'Definition'}
                </span>
                <span className="text-gray-600 leading-relaxed">{item.definition}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-emerald-600 text-lg">💡</span>
              <div>
                <span className="font-semibold text-gray-700 block mb-1">
                  {t('pages.vocabulary.example') || 'Example'}
                </span>
                <span className="text-gray-600 italic leading-relaxed">"{item.example}"</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 text-lg">🏷️</span>
                <div>
                  <span className="font-semibold text-gray-700 text-sm block">
                    {t('pages.vocabulary.category') || 'Category'}
                  </span>
                  <span className="text-gray-600">{item.category}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2">
                <span className="text-purple-600 text-lg">📊</span>
                <div>
                  <span className="font-semibold text-gray-700 text-sm block">
                    {t('pages.vocabulary.level') || 'Level'}
                  </span>
                  <span className="text-gray-600">{item.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Change Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 ${
              item.status === 'learned'
                ? 'bg-emerald-500 text-white scale-105 shadow-emerald-200'
                : 'bg-gray-200 text-gray-700 hover:bg-emerald-100 hover:scale-105'
            }`}
            onClick={() => onStatusChange('learned')}
          >
            ✅ {t('pages.vocabulary.status.learned') || 'Learned'}
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 ${
              item.status === 'learning'
                ? 'bg-blue-500 text-white scale-105 shadow-blue-200'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100 hover:scale-105'
            }`}
            onClick={() => onStatusChange('learning')}
          >
            ⏳ {t('pages.vocabulary.status.learning') || 'Learning'}
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-bold shadow-lg transition-all duration-200 ${
              item.status === 'toLearn'
                ? 'bg-gray-500 text-white scale-105 shadow-gray-200'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
            }`}
            onClick={() => onStatusChange('toLearn')}
          >
            📚 {t('pages.vocabulary.status.toLearn') || 'To Learn'}
          </button>
        </div>
      </div>
    </div>
  );
} 
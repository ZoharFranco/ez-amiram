import { useState, useRef, useCallback } from 'react';
import { VocabularyWord, WordStatus } from '@/lib/types/vocabulary';
import BackButton from './BackButton';
import LevelHeader from './LevelHeader';
import WordGrid from './WordGrid';
import QuizButton from './QuizButton';
import WordDetailModal from './WordDetailModal';
import QuizGame from './QuizGame';
import QuizTypeSelector from './QuizTypeSelector';

type QuizState = {
  current: number;
  order: number[];
  correct: number;
  finished: boolean;
  showAnswer: boolean;
  selectedOption: string | null;
  questionType: 'hebrew-to-english' | 'english-to-hebrew' | 'definition-to-hebrew' | 'example-to-hebrew';
  options: string[];
  streak: number;
  confetti: boolean;
};

type LevelViewProps = {
  level: number;
  words: VocabularyWord[];
  onBack: () => void;
  onStatusChange: (word: VocabularyWord, status: WordStatus) => void;
  onStartQuiz: () => void;
  quizOpen: boolean;
  onCloseQuiz: () => void;
};

export default function LevelView({
  level,
  words,
  onBack,
  onStatusChange,
  onStartQuiz,
  quizOpen,
  onCloseQuiz
}: LevelViewProps) {
  const learnedCount = words.filter(word => word.status === 'learned').length;
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const learningCount = words.filter(word => word.status === 'learning').length;
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuizState['questionType'][]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleWordClick = (word: VocabularyWord) => {
    setSelectedWord(word);
  };

  const handleStatusChange = useCallback((status: WordStatus) => {
    if (selectedWord) {
      // Preserve scroll position
      const scrollPosition = scrollContainerRef.current?.scrollTop || 0;
      
      onStatusChange(selectedWord, status);
      setSelectedWord({ ...selectedWord, status });
      
      // Restore scroll position after state update
      requestAnimationFrame(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = scrollPosition;
        }
      });
    }
  }, [selectedWord, onStatusChange]);

  const handleStartQuiz = () => {
    // Start with random questions by default
    onStartQuiz();
  };

  const handleTypeSelectorClose = () => {
    setShowTypeSelector(false);
  };

  const handleTypeSelectorStart = (types: QuizState['questionType'][]) => {
    setSelectedQuestionTypes(types);
    setShowTypeSelector(false);
    onStartQuiz();
  };

  return (
    <div
      className={`min-h-screen flex flex-col ${
        showTypeSelector ? 'backdrop-blur-sm' : ''
      }`}
    >
      {/* Sticky header section with back button and level header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="px-2 py-3 sm:px-4 sm:py-3 max-w-full sm:max-w-6xl mx-auto">
          <div className="mb-1 sm:mb-1">
            <BackButton onClick={onBack} />
          </div>
          <LevelHeader
            level={level}
            wordCount={words.length}
            learnedCount={learnedCount}
            learningCount={learningCount}
            // LevelHeader should use responsive text and padding internally
          />
        </div>
      </div>

      {/* Enhanced scrollable word grid */}
      <div className="flex-1 relative">
        <div 
          ref={scrollContainerRef}
          className="h-full overflow-y-auto overflow-x-hidden custom-scrollbar smooth-scroll"
          style={{
            scrollBehavior: 'smooth',
            scrollbarWidth: 'thin',
            scrollbarColor: '#10b981 #f3f4f6',
          }}
        >
          <div className="p-4 pb-24 max-w-full sm:max-w-6xl mx-auto">
            <WordGrid
              words={words}
              onWordClick={handleWordClick}
            />
          </div>
        </div>
        
        {/* Scroll to top button - only show when there are many words */}
        {words.length > 12 && (
          <button
            onClick={() => {
              scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="absolute bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-20 opacity-80 hover:opacity-100"
            aria-label="Scroll to top"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>

      {/* Fixed quiz button at bottom */}
      <div className="sticky bottom-0 bg-white/95 backdrop-blur-sm pt-2 pb-2 sm:pt-4 sm:pb-4 border-t border-gray-100 shadow-lg z-30">
        <div className="max-w-full sm:max-w-6xl mx-auto px-2 sm:px-4">
          <QuizButton
            onClick={handleStartQuiz}
            wordCount={words.length}
            // QuizButton should use responsive text and padding internally
          />
        </div>
      </div>

      {/* Modals */}
      {selectedWord && (
        <WordDetailModal
          item={selectedWord}
          onClose={() => setSelectedWord(null)}
          onStatusChange={handleStatusChange}
          // WordDetailModal should use responsive text and padding internally
        />
      )}

      {quizOpen && (
        <QuizGame
          items={words}
          onClose={onCloseQuiz}
          selectedQuestionTypes={selectedQuestionTypes}
          // QuizGame should use responsive text and padding internally
        />
      )}

      {showTypeSelector && (
        <QuizTypeSelector
          onStart={handleTypeSelectorStart}
          onClose={handleTypeSelectorClose}
          // QuizTypeSelector should use responsive text and padding internally
        />
      )}
    </div>
  );
} 
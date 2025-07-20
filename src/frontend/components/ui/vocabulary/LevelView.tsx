import { useState } from 'react';
import { VocabularyWord, WordStatus } from '@/config/content/vocabulary/vocabulary';
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
  const handleWordClick = (word: VocabularyWord) => {
    setSelectedWord(word);
  };

  const handleStatusChange = (status: WordStatus) => {
    if (selectedWord) {
      onStatusChange(selectedWord, status);
      setSelectedWord({ ...selectedWord, status });
    }
  };

  const handleStartQuiz = () => {
    // Start with random questions by default
    onStartQuiz();
  };

  const handleAdvancedSettings = () => {
    setShowTypeSelector(true);
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
      className={`min-h-screen flex flex-col px-2 py-4 sm:px-4 sm:py-4 max-w-full sm:max-w-6xl mx-auto ${
        showTypeSelector ? 'backdrop-blur-sm' : ''
      }`}
    >
      <div className="">
        <BackButton onClick={onBack} />
      </div>
      <div className="mb-2 sm:mb-4">
        <LevelHeader
          level={level}
          wordCount={words.length}
          learnedCount={learnedCount}
          learningCount={learningCount}
          // LevelHeader should use responsive text and padding internally
        />
      </div>

      {/* Scrollable word grid */}
      <div className="flex-1 overflow-y-auto mb-2 max-h-[150vh]">
        <WordGrid
          words={words}
          onWordClick={handleWordClick}
          // WordGrid should use responsive grid, text, and padding internally
        />
      </div>

      {/* Fixed quiz button at bottom */}
      <div className="sticky bottom-0 bg-white pt-2 pb-2 sm:pt-4 sm:pb-4 border-t border-gray-100">
        <QuizButton
          onClick={handleStartQuiz}
          onAdvancedSettings={handleAdvancedSettings}
          wordCount={words.length}
          // QuizButton should use responsive text and padding internally
        />
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
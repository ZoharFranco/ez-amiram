'use client';

import { VocabularyWord, vocabularyWords, WordStatus } from '@/config/content/vocabulary/vocabulary';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useState } from 'react';



// --- Small Components ---

function getStatusColor(status: WordStatus | undefined) {
  switch (status) {
    case 'learned':
      return 'bg-emerald-100 border-emerald-400 text-emerald-800';
    case 'learning':
      return 'bg-blue-100 border-blue-400 text-blue-800';
    case 'toLearn':
    default:
      return 'bg-gray-100 border-gray-300 text-gray-800';
  }
}

type WordCardProps = {
  item: VocabularyWord;
  onClick: () => void;
};

// Show the English word as the title on the card
function WordCard({ item, onClick }: WordCardProps) {
  return (
    <div
      className={`p-3 rounded-lg border flex justify-between items-center cursor-pointer transition ${getStatusColor(item.status)}`}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={item.word}
    >
      <span className="text-xs font-semibold">
        {item.status === 'learned' ? '✓' : item.status === 'learning' ? '⏳' : '•'}
      </span>
      <span className="font-medium text-emerald-700 text-lg">{item.word}</span>

    </div>
  );
}

type WordDetailModalProps = {
  item: VocabularyWord;
  onClose: () => void;
  onStatusChange: (status: WordStatus) => void;
  t: (key: string) => string;
};

// Engaging, visually rich modal for word details
function WordDetailModal({ item, onClose, onStatusChange, t }: WordDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-emerald-200">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
          aria-label={t('pages.vocabulary.close') || 'Close'}
        >
          ×
        </button>
        {/* English word as main title */}
        <h2 className="text-4xl font-extrabold text-emerald-700 text-center mb-8 tracking-wide drop-shadow">
          {item.word}
        </h2>
        {/* Hebrew word as subtitle */}
        <div className="text-2xl text-gray-700 text-center mb-4 font-semibold">
          {item.hebrewTranslation}
        </div>
        {/* Details grid */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('pages.vocabulary.definition') || 'Definition'}:</span>
            <span className="text-gray-600">{item.definition}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('pages.vocabulary.example') || 'Example'}:</span>
            <span className="italic text-gray-500">`{item.example}`</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('pages.vocabulary.category') || 'Category'}:</span>
            <span className="text-gray-600">{item.category}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">{t('pages.vocabulary.level') || 'Level'}:</span>
            <span className="text-gray-600">{item.level}</span>
          </div>
        </div>
        {/* Status change buttons */}
        <div className="flex gap-3 justify-center mb-2">
          <button
            className={`px-4 py-2 rounded-lg font-bold shadow transition ${item.status === 'learned'
                ? 'bg-emerald-500 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-emerald-100'
              }`}
            onClick={() => onStatusChange('learned')}
          >
            {t('pages.vocabulary.status.learned') || 'Learned'}
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold shadow transition ${item.status === 'learning'
                ? 'bg-blue-500 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
              }`}
            onClick={() => onStatusChange('learning')}
          >
            {t('pages.vocabulary.status.learning') || 'Learning'}
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-bold shadow transition ${item.status === 'toLearn'
                ? 'bg-gray-500 text-white scale-105'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() => onStatusChange('toLearn')}
          >
            {t('pages.vocabulary.status.toLearn') || 'To Learn'}
          </button>
        </div>

      </div>
    </div>
  );
}

type GroupListProps = {
  groupedVocabularyWord: Record<string, VocabularyWord[]>;
  onSelectGroup: (group: string) => void;
  getProgress: (items: VocabularyWord[]) => number;
  viewBy: ViewBy;
  t: (key: string) => string;
};

function GroupList({ groupedVocabularyWord, onSelectGroup, getProgress, viewBy, t }: GroupListProps) {
  return (
    <div className="space-y-4 m-6">
      {Object.entries(groupedVocabularyWord).map(([groupName, items]) => {
        const progress = getProgress(items);
        // Determine the label for the group type
        const groupLabel =
          viewBy === 'category'
            ? t('pages.vocabulary.category') || 'Category'
            : t('pages.vocabulary.level') || 'Level';
        return (
          <div
            key={groupName}
            className="cursor-pointer p-4 rounded-lg border hover:bg-emerald-50 transition"
            onClick={() => onSelectGroup(groupName)}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-gray-500 text-base">{groupLabel}:</span>
                <span>{groupName}</span>
              </h2>
              <div className="flex flex-col items-end min-w-[80px]">
                <span className="text-xs text-gray-500 mb-1">
                  <span className="mr-3 text-lg font-bold text-emerald-600">{Math.ceil(progress)}%</span>
                  <span className="text-lg font-semibold text-emerald-700 ml-1">
                    {items.filter((i) => i.status === 'learned').length}
                  </span>
                  <span className="text-lg text-gray-400">/</span>
                  <span className="text-lg font-semibold">{items.length}</span>
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-emerald-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

type WordListProps = {
  items: VocabularyWord[];
  onWordClick: (item: VocabularyWord) => void;
  t: (key: string) => string;
};

// Helper to sort words by status: learned > learning > toLearn
function sortWordsByStatus(items: VocabularyWord[]): VocabularyWord[] {
  // Fix: Use an array for status order and indexOf for comparison
  const statusOrder = ['learned', 'learning', 'toLearn'];
  return [...items].sort((a, b) => {
    const aIdx = statusOrder.indexOf(a.status);
    const bIdx = statusOrder.indexOf(b.status);
    // If status is not found, put it at the end
    return (aIdx === -1 ? statusOrder.length : aIdx) - (bIdx === -1 ? statusOrder.length : bIdx);
  });
}

// Helper to chunk array into rows of 2
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

function WordList({ items, onWordClick, t }: WordListProps) {
  if (items.length === 0) {
    return <div className="text-center text-gray-500">{t('pages.vocabulary.noWords') || 'No words in this group.'}</div>;
  }
  // Sort by status and chunk into rows of 2
  const sorted = sortWordsByStatus(items);
  const rows = chunkArray(sorted, 2);
  return (
    <div className="space-y-2">
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex gap-2">
          {row.map((item, i) => (
            <div key={i} className="flex-1">
              <WordCard item={item} onClick={() => onWordClick(item)} />
            </div>
          ))}
          {row.length < 2 && <div className="flex-1" />} {/* empty cell for alignment if odd */}
        </div>
      ))}
    </div>
  );
}

// --- Quiz Game Component ---
// ENHANCED: Multiple-choice, more engaging, random question types

type QuizState = {
  current: number;
  order: number[];
  correct: number;
  finished: boolean;
  showAnswer: boolean;
  selectedOption: string | null;
  questionType: 'hebrew-to-english' | 'english-to-hebrew' | 'definition-to-hebrew' | 'example-to-hebrew';
  options: string[];
};

function shuffleArray<T>(array: T[]): T[] {
  // Fisher-Yates shuffle
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Helper to get random elements from an array, excluding a value
function getRandomOptions<T>(
  arr: T[],
  correct: T,
  count: number,
  getValue: (item: T) => string
): string[] {
  const filtered = arr.filter((item) => getValue(item) !== getValue(correct));
  const shuffled = shuffleArray(filtered);
  const options = shuffled.slice(0, count - 1).map(getValue);
  options.push(getValue(correct));
  return shuffleArray(options);
}

type QuizGameProps = {
  items: VocabularyWord[];
  onClose: () => void;
  t: (key: string) => string;
};

function getRandomQuestionType(): QuizState['questionType'] {
  // Weighted: more likely to get translation/definition, but sometimes example
  const types: QuizState['questionType'][] = [
    'hebrew-to-english',
    'english-to-hebrew',
    'definition-to-hebrew',
    'example-to-hebrew',
    'english-to-hebrew',
    'definition-to-hebrew',
  ];
  return types[Math.floor(Math.random() * types.length)];
}

function getOptionsForQuestion(
  items: VocabularyWord[],
  currentItem: VocabularyWord,
  questionType: QuizState['questionType']
): string[] {
  // Always 4 options
  switch (questionType) {
    case 'hebrew-to-english':
      return getRandomOptions(items, currentItem, 4, (item) => item.hebrewTranslation);
    case 'english-to-hebrew':
    case 'definition-to-hebrew':
    case 'example-to-hebrew':
    default:
      return getRandomOptions(items, currentItem, 4, (item) => item.word);
  }
}

function getQuestionPrompt(
  t: (key: string) => string,
  questionType: QuizState['questionType'],
  currentItem: VocabularyWord
): { prompt: string; main: string; sub?: string } {
  switch (questionType) {
    case 'hebrew-to-english':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.hebrewToEnglish') || 'What is the English translation of:',
        main: currentItem.word,
        sub: currentItem.definition,
      };
    case 'english-to-hebrew':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.englishToHebrew') || 'What is the Hebrew word for:',
        main: currentItem.hebrewTranslation,
        sub: currentItem.definition,
      };
    case 'definition-to-hebrew':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.definitionToHebrew') || 'Which Hebrew word matches this definition?',
        main: currentItem.definition,
        sub: currentItem.hebrewTranslation,
      };
    case 'example-to-hebrew':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.exampleToHebrew') || 'Which Hebrew word fits this example?',
        main: currentItem.example,
        sub: currentItem.hebrewTranslation,
      };
    default:
      return {
        prompt: '',
        main: '',
      };
  }
}

function QuizGame({ items, onClose, t }: QuizGameProps) {
  // Prepare shuffled order and question types
  const [state, setState] = useState<QuizState>(() => {
    const order = shuffleArray(items.map((_, i) => i));
    const firstIdx = order[0];
    const firstType = getRandomQuestionType();
    const firstOptions = getOptionsForQuestion(items, items[firstIdx], firstType);
    return {
      current: 0,
      order,
      correct: 0,
      finished: false,
      showAnswer: false,
      selectedOption: null,
      questionType: firstType,
      options: firstOptions,
    };
  });

  const currentIdx = state.order[state.current];
  const currentItem = items[currentIdx];

  // Prepare question prompt and options
  const { prompt, main, sub } = getQuestionPrompt(t, state.questionType, currentItem);

  function handleOptionSelect(option: string) {
    if (state.showAnswer) return;
    setState((s) => ({
      ...s,
      selectedOption: option,
      showAnswer: true,
      correct:
        isCorrectAnswer(option, currentItem, state.questionType)
          ? s.correct + 1
          : s.correct,
    }));
  }

  function isCorrectAnswer(option: string, item: VocabularyWord, type: QuizState['questionType']) {
    switch (type) {
      case 'hebrew-to-english':
        return option === item.hebrewTranslation;
      case 'english-to-hebrew':
      case 'definition-to-hebrew':
      case 'example-to-hebrew':
      default:
        return option === item.word;
    }
  }

  function handleNext() {
    if (state.current + 1 >= state.order.length) {
      setState((s) => ({ ...s, finished: true }));
    } else {
      const nextIdx = state.order[state.current + 1];
      const nextType = getRandomQuestionType();
      const nextOptions = getOptionsForQuestion(items, items[nextIdx], nextType);
      setState((s) => ({
        ...s,
        current: s.current + 1,
        showAnswer: false,
        selectedOption: null,
        questionType: nextType,
        options: nextOptions,
      }));
    }
  }

  function handleRestart() {
    const order = shuffleArray(items.map((_, i) => i));
    const firstIdx = order[0];
    const firstType = getRandomQuestionType();
    const firstOptions = getOptionsForQuestion(items, items[firstIdx], firstType);
    setState({
      current: 0,
      order,
      correct: 0,
      finished: false,
      showAnswer: false,
      selectedOption: null,
      questionType: firstType,
      options: firstOptions,
    });
  }

  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label={t('pages.vocabulary.close') || 'Close'}
          >
            ×
          </button>
          <div className="text-center text-gray-500">{t('pages.vocabulary.noWords') || 'No words in this group.'}</div>
        </div>
      </div>
    );
  }

  if (state.finished) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
            onClick={onClose}
            aria-label={t('pages.vocabulary.close') || 'Close'}
          >
            ×
          </button>
          <h2 className="text-2xl font-bold mb-4">{t('pages.vocabulary.quiz.finished') || 'Quiz Finished!'}</h2>
          <div className="mb-4 text-center">
            {t('pages.vocabulary.quiz.score') || 'Score'}: {state.correct} / {state.order.length}
          </div>
          <div className="flex gap-2 justify-center">
            <button
              className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold"
              onClick={handleRestart}
            >
              {t('pages.vocabulary.quiz.restart') || 'Restart'}
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-300 text-gray-700 font-semibold"
              onClick={onClose}
            >
              {t('pages.vocabulary.quiz.close') || 'Close'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Engaging: show progress bar, random question types, multiple-choice, feedback
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label={t('pages.vocabulary.close') || 'Close'}
        >
          ×
        </button>
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">
              {t('pages.vocabulary.quiz.progress') || 'Question'} {state.current + 1} / {state.order.length}
            </span>
            <span className="text-sm text-gray-500">
              {t('pages.vocabulary.quiz.score') || 'Score'}: {state.correct}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-emerald-500 rounded-full transition-all"
              style={{ width: `${((state.current + (state.showAnswer ? 1 : 0)) / state.order.length) * 100}%` }}
            />
          </div>
        </div>
        {/* Question */}
        <div className="mb-4">
          <div className="text-lg font-semibold mb-2">{prompt}</div>
          <div className="text-2xl text-emerald-700 font-bold mb-2">{main}</div>
          {sub && (
            <div className="text-gray-600 mb-2">
              <span className="font-semibold">{t('pages.vocabulary.quiz.extraHint') || 'Hint'}: </span>
              {sub}
            </div>
          )}
        </div>
        {/* Options */}
        <div className="mb-4 space-y-2">
          {state.options.map((option) => {
            let optionStyle =
              'w-full px-4 py-2 rounded border text-lg text-left transition cursor-pointer';
            const isCorrect = isCorrectAnswer(option, currentItem, state.questionType);
            if (state.showAnswer) {
              if (option === state.selectedOption) {
                optionStyle += isCorrect
                  ? ' bg-emerald-200 border-emerald-500'
                  : ' bg-red-200 border-red-500';
              } else if (isCorrect) {
                optionStyle += ' bg-emerald-100 border-emerald-400';
              } else {
                optionStyle += ' bg-gray-100 border-gray-200';
              }
            } else {
              optionStyle += ' bg-white border-gray-300 hover:bg-emerald-50';
            }
            return (
              <button
                key={option}
                className={optionStyle}
                onClick={() => handleOptionSelect(option)}
                disabled={state.showAnswer}
                tabIndex={0}
                aria-label={option}
              >
                {option}
              </button>
            );
          })}
        </div>
        {/* Feedback */}
        {state.showAnswer && (
          <div className="mb-4">
            {isCorrectAnswer(state.selectedOption ?? '', currentItem, state.questionType) ? (
              <div className="text-emerald-600 font-semibold flex items-center gap-2">
                <span>✔️</span>
                {t('pages.vocabulary.quiz.correct') || 'Correct!'}
              </div>
            ) : (
              <div className="text-red-600 font-semibold flex flex-col gap-1">
                <span>❌ {t('pages.vocabulary.quiz.incorrect') || 'Incorrect.'}</span>
                <span>
                  {t('pages.vocabulary.quiz.answer') || 'Answer'}:{' '}
                  <span className="font-bold">
                    {(() => {
                      switch (state.questionType) {
                        case 'hebrew-to-english':
                          return currentItem.hebrewTranslation;
                        case 'english-to-hebrew':
                        case 'definition-to-hebrew':
                        case 'example-to-hebrew':
                        default:
                          return currentItem.word;
                      }
                    })()}
                  </span>
                </span>
              </div>
            )}
          </div>
        )}
        {/* Next/Finish Button */}
        <div className="flex gap-2 justify-center">
          {state.showAnswer && (
            <button
              className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold"
              onClick={handleNext}
            >
              {state.current + 1 === state.order.length
                ? t('pages.vocabulary.quiz.finish') || 'Finish'
                : t('pages.vocabulary.quiz.next') || 'Next'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---
type ViewBy = 'category' | 'level';

export default function VocabularyPage() {
  const { t } = useLanguage();
  // Set 'level' as the default view
  const [viewBy, setViewBy] = useState<ViewBy>('level');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [modalWord, setModalWord] = useState<VocabularyWord | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>(vocabularyWords);
  const [quizOpen, setQuizOpen] = useState(false);

  // Group sub-items by category or level
  const groupedVocabularyWords = words.reduce<Record<string, VocabularyWord[]>>((groups, item) => {
    const key = viewBy === 'category' ? item.category : item.level;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  // Calculate progress for a group (learned / total)
  function getProgress(items: VocabularyWord[]) {
    const total = items.length;
    const learned = items.filter((i) => i.status === 'learned').length;
    return total > 0 ? (learned / total) * 100 : 0;
  }

  // Handler for changing word status
  function handleStatusChange(word: VocabularyWord, status: WordStatus) {
    setWords((prev) =>
      prev.map((w) =>
        w.word === word.word && w.category === word.category && w.level === word.level
          ? { ...w, status }
          : w
      )
    );
    setModalWord((prev) => prev && prev.word === word.word ? { ...prev, status } : prev);
  }

  // Detail view for selected group
  if (selectedGroup) {
    const items = groupedVocabularyWords[selectedGroup] ?? [];
    return (
      <ClientLayout>
        <div className="min-h-screen px-4 py-6 max-w-md mx-auto">
          <button
            onClick={() => setSelectedGroup(null)}
            className="text-emerald-600 hover:underline mb-4"
          >
            {t('pages.vocabulary.back') || 'חזרה'}
          </button>
          <h1 className="text-4xl font-bold text-center mb-10">{selectedGroup}</h1>
          <WordList
            items={items}
            onWordClick={setModalWord}
            t={t}
          />
          {/* Large Quiz Button */}
          <div className="flex justify-center mt-10">
            <button
              className="w-full max-w-xs py-4 px-6 rounded-lg bg-emerald-600 text-white text-xl font-bold shadow-lg hover:bg-emerald-700 transition"
              onClick={() => setQuizOpen(true)}
              data-testid="start-quiz-btn"
            >
              {t('pages.vocabulary.quiz.start') || 'Start Quiz'}
            </button>
          </div>
          {quizOpen && (
            <QuizGame
              items={items}
              onClose={() => setQuizOpen(false)}
              t={t}
            />
          )}
          {modalWord && (
            <WordDetailModal
              item={modalWord}
              onClose={() => setModalWord(null)}
              onStatusChange={(status) => handleStatusChange(modalWord, status)}
              t={t}
            />
          )}
        </div>
      </ClientLayout>
    );
  }

  // Main grouping view
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-10">
        <PageTitle
          title={t('pages.vocabulary.title')}
          subtitle={t('pages.vocabulary.subtitle')}
          color="blue"
        />
        <div className="mb-30">
          <div className="flex justify-center gap-4 m-4">
            <SelectionButton
              onClick={() => {
                setViewBy('category');
                setSelectedGroup(null);
              }}
              text={t('pages.vocabulary.selection.category')}
              selected={viewBy === 'category'}
            />
            <SelectionButton
              onClick={() => {
                setViewBy('level');
                setSelectedGroup(null);
              }}
              text={t('pages.vocabulary.selection.level')}
              selected={viewBy === 'level'}
            />
          </div>
          <GroupList
            groupedVocabularyWord={groupedVocabularyWords}
            onSelectGroup={setSelectedGroup}
            getProgress={getProgress}
            viewBy={viewBy}
            t={t}
          />
        </div>
      </div>
    </ClientLayout>
  );
}

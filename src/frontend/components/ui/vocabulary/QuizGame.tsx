import { useState, useRef, useEffect } from 'react';
import { VocabularyWord } from '@/config/content/vocabulary/vocabulary';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

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

type QuizGameProps = {
  items: VocabularyWord[];
  onClose: () => void;
  selectedQuestionTypes?: QuizState['questionType'][];
};

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

function getRandomQuestionType(selectedTypes?: QuizState['questionType'][]): QuizState['questionType'] {
  const allTypes: QuizState['questionType'][] = [
    'hebrew-to-english',
    'english-to-hebrew',
    'definition-to-hebrew',
    'example-to-hebrew',
  ];
  
  const typesToUse = selectedTypes && selectedTypes.length > 0 ? selectedTypes : allTypes;
  return typesToUse[Math.floor(Math.random() * typesToUse.length)];
}

function getOptionsForQuestion(
  items: VocabularyWord[],
  currentItem: VocabularyWord,
  questionType: QuizState['questionType']
): string[] {
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
): { prompt: string; main: string; sub?: string; emoji: string } {
  switch (questionType) {
    case 'hebrew-to-english':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.hebrewToEnglish') || 'What is the English translation of:',
        main: currentItem.word,
        sub: currentItem.definition,
        emoji: '🇮🇱➡️🇬🇧',
      };
    case 'english-to-hebrew':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.englishToHebrew') || 'What is the Hebrew word for:',
        main: currentItem.hebrewTranslation,
        sub: currentItem.definition,
        emoji: '🇬🇧➡️🇮🇱',
      };
    case 'definition-to-hebrew':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.definitionToHebrew') || 'Which Hebrew word matches this definition?',
        main: currentItem.definition,
        sub: currentItem.hebrewTranslation,
        emoji: '📖➡️🇮🇱',
      };
    case 'example-to-hebrew':
      return {
        prompt: t('pages.vocabulary.quiz.prompt.exampleToHebrew') || 'Which Hebrew word fits this example?',
        main: currentItem.example,
        sub: currentItem.hebrewTranslation,
        emoji: '💬➡️🇮🇱',
      };
    default:
      return {
        prompt: '',
        main: '',
        emoji: '❓',
      };
  }
}

// Confetti animation (simple SVG burst)
function ConfettiBurst() {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center z-[100] animate-fade-in">
      <svg width="300" height="300" viewBox="0 0 300 300" className="absolute">
        {[...Array(24)].map((_, i) => {
          const angle = (i / 24) * 2 * Math.PI;
          const x = 150 + Math.cos(angle) * 120;
          const y = 150 + Math.sin(angle) * 120;
          const color = [
            '#34d399', '#fbbf24', '#f472b6', '#60a5fa', '#f87171', '#a78bfa', '#facc15'
          ][i % 7];
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={10 + (i % 3) * 4}
              fill={color}
              opacity="0.8"
              style={{
                transformOrigin: '150px 150px',
                animation: `confetti-burst 0.8s cubic-bezier(.4,2,.6,1) ${i * 0.02}s both`
              }}
            />
          );
        })}
        <style>{`
          @keyframes confetti-burst {
            0% { transform: scale(0.2); opacity: 1; }
            80% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); opacity: 0; }
          }
        `}</style>
      </svg>
    </div>
  );
}

export default function QuizGame({ items, onClose, selectedQuestionTypes }: QuizGameProps) {
  const { t } = useLanguage();

  // Only use 7 words for the quiz, shuffle if more
  const quizItems = items.length > 7 ? shuffleArray(items).slice(0, 7) : [...items];

  const [state, setState] = useState<QuizState>(() => {
    const order = shuffleArray(quizItems.map((_, i) => i));
    const firstIdx = order[0];
    const firstType = getRandomQuestionType(selectedQuestionTypes);
    const firstOptions = getOptionsForQuestion(quizItems, quizItems[firstIdx], firstType);
    return {
      current: 0,
      order,
      correct: 0,
      finished: false,
      showAnswer: false,
      selectedOption: null,
      questionType: firstType,
      options: firstOptions,
      streak: 0,
      confetti: false,
    };
  });

  const currentIdx = state.order[state.current];
  const currentItem = quizItems[currentIdx];
  const { prompt, main, sub, emoji } = getQuestionPrompt(t, state.questionType, currentItem);

  // For animated progress bar
  const progressRef = useRef<HTMLDivElement>(null);

  // Confetti effect for correct answer streaks
  useEffect(() => {
    if (state.confetti) {
      const timeout = setTimeout(() => {
        setState((s) => ({ ...s, confetti: false }));
      }, 900);
      return () => clearTimeout(timeout);
    }
  }, [state.confetti]);

  function handleOptionSelect(option: string) {
    if (state.showAnswer) return;
    const isCorrect = isCorrectAnswer(option, currentItem, state.questionType);
    setState((s) => ({
      ...s,
      selectedOption: option,
      showAnswer: true,
      correct: isCorrect ? s.correct + 1 : s.correct,
      streak: isCorrect ? s.streak + 1 : 0,
      confetti: isCorrect && s.streak + 1 >= 2, // Confetti for 2+ streak
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
      const nextType = getRandomQuestionType(selectedQuestionTypes);
      const nextOptions = getOptionsForQuestion(quizItems, quizItems[nextIdx], nextType);
      setState((s) => ({
        ...s,
        current: s.current + 1,
        showAnswer: false,
        selectedOption: null,
        questionType: nextType,
        options: nextOptions,
        confetti: false,
      }));
    }
  }

  function handleRestart() {
    const order = shuffleArray(quizItems.map((_, i) => i));
    const firstIdx = order[0];
    const firstType = getRandomQuestionType(selectedQuestionTypes);
    const firstOptions = getOptionsForQuestion(quizItems, quizItems[firstIdx], firstType);
    setState({
      current: 0,
      order,
      correct: 0,
      finished: false,
      showAnswer: false,
      selectedOption: null,
      questionType: firstType,
      options: firstOptions,
      streak: 0,
      confetti: false,
    });
  }

  if (quizItems.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 relative border-4 border-dashed border-emerald-200">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label={t('pages.vocabulary.close') || 'Close'}
          >
            ×
          </button>
          <div className="text-center text-gray-500 py-8">
            <div className="text-5xl mb-4 animate-bounce">📚</div>
            <p className="text-lg font-semibold">{t('pages.vocabulary.noWords') || 'No words in this group.'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.finished) {
    const percentage = Math.round((state.correct / state.order.length) * 100);
    let emoji = '📚';
    if (percentage === 100) emoji = '🏆';
    else if (percentage >= 85) emoji = '🎉';
    else if (percentage >= 70) emoji = '👏';
    else if (percentage >= 50) emoji = '👍';
    else emoji = '🌱';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-10 relative border-4 border-emerald-200">
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label={t('pages.vocabulary.close') || 'Close'}
          >
            ×
          </button>
          <div className="text-center">
            <div className="text-7xl mb-4 animate-bounce">{emoji}</div>
            <h2 className="text-4xl font-extrabold mb-4 text-emerald-700 drop-shadow">
              {t('pages.vocabulary.quiz.finished') || 'Quiz Finished!'}
            </h2>
            <div className="text-5xl font-bold text-emerald-600 mb-2 drop-shadow">
              {state.correct} / {state.order.length}
            </div>
            <div className="text-lg text-gray-600 mb-6">
              <span className="font-bold">{percentage}%</span> {t('pages.vocabulary.quiz.score') || 'Score'}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
                onClick={handleRestart}
              >
                🔄 {t('pages.vocabulary.quiz.restart') || 'Restart'}
              </button>
              <button
                className="px-8 py-3 rounded-xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors shadow"
                onClick={onClose}
              >
                {t('pages.vocabulary.quiz.close') || 'Close'}
              </button>
            </div>
            <div className="mt-8 text-center text-gray-400 text-xs">
              {t('pages.vocabulary.quiz.sevenWords') || 'Quiz is always 7 words for a quick challenge!'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Animated background with enhanced blur
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-emerald-100 to-blue-100 backdrop-blur-md">
      {state.confetti && <ConfettiBurst />}
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-2 sm:mx-4 p-4 sm:p-8 relative border border-emerald-100">
        <button
          className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-400 hover:text-gray-700 text-xl sm:text-2xl"
          onClick={onClose}
          aria-label={t('pages.vocabulary.close') || 'Close'}
        >
          ×
        </button>

        {/* Progress bar - modern, simple */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide">
              {t('pages.vocabulary.quiz.progress') || 'Question'} {state.current + 1} / {state.order.length}
            </span>
            <span className="text-xs sm:text-sm text-gray-500 font-semibold tracking-wide">
              {t('pages.vocabulary.quiz.score') || 'Score'}: {state.correct}
            </span>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 flex items-center justify-center"
              style={{ width: `${((state.current + (state.showAnswer ? 1 : 0)) / state.order.length) * 100}%` }}
            >
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] sm:text-xs text-emerald-900 font-bold">
                {Math.round(((state.current + (state.showAnswer ? 1 : 0)) / state.order.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">{emoji}</span>
            <span className="text-lg sm:text-xl font-semibold text-emerald-700">{prompt}</span>
          </div>
          <div className="text-2xl sm:text-3xl text-emerald-700 font-extrabold mb-2 text-center drop-shadow-sm leading-tight">
            {main}
          </div>
          {sub && (
            <div className="text-gray-500 mb-2 text-center text-xs sm:text-base">
              <span className="font-semibold">{t('pages.vocabulary.quiz.extraHint') || 'Hint'}: </span>
              {sub}
            </div>
          )}
        </div>

        {/* Options - modern card buttons */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.options.map((option) => {
            const isCorrect = isCorrectAnswer(option, currentItem, state.questionType);
            let optionStyle =
              'w-full px-3 py-3 rounded-xl border-2 text-base sm:text-lg font-semibold text-center transition-all duration-200 cursor-pointer shadow-sm hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-emerald-400';
            if (state.showAnswer) {
              if (option === state.selectedOption) {
                optionStyle += isCorrect
                  ? ' bg-gradient-to-r from-emerald-100 to-emerald-50 border-emerald-400 text-emerald-800 animate-pulse'
                  : ' bg-gradient-to-r from-red-100 to-red-50 border-red-400 text-red-800 animate-shake';
              } else if (isCorrect) {
                optionStyle += ' bg-emerald-50 border-emerald-300 text-emerald-700';
              } else {
                optionStyle += ' bg-gray-50 border-gray-200 text-gray-500';
              }
            } else {
              optionStyle += ' bg-white border-gray-200 hover:bg-emerald-50 hover:border-emerald-200';
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
          <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-blue-50 shadow-inner">
            {isCorrectAnswer(state.selectedOption ?? '', currentItem, state.questionType) ? (
              <div className="text-emerald-600 font-bold flex items-center justify-center gap-2 text-lg animate-bounce">
                <span>✅</span>
                {t('pages.vocabulary.quiz.correct') || 'Correct!'}
                {state.streak >= 2 && (
                  <span className="ml-2 text-xl animate-pulse">🔥 {t('pages.vocabulary.quiz.streak') || 'Streak!'} {state.streak}</span>
                )}
              </div>
            ) : (
              <div className="text-red-600 font-bold text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span>❌</span>
                  <span>{t('pages.vocabulary.quiz.incorrect') || 'Incorrect.'}</span>
                </div>
                <div className="text-xs sm:text-sm">
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
                </div>
              </div>
            )}
          </div>
        )}

        {/* Next/Finish Button */}
        <div className="flex justify-center">
          {state.showAnswer && (
            <button
              className="px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-bold text-base sm:text-lg hover:scale-105 transition-transform shadow-md"
              onClick={handleNext}
            >
              {state.current + 1 === state.order.length
                ? t('pages.vocabulary.quiz.finish') || 'Finish'
                : t('pages.vocabulary.quiz.next') || 'Next'}
            </button>
          )}
        </div>
      </div>
      <style>{`
        .animate-shake {
          animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-4px); }
          40%, 60% { transform: translateX(4px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
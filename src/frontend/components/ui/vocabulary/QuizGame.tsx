import { useState, useEffect } from 'react';
import { VocabularyWord } from '@/lib/types/vocabulary';

type QuestionType = 'hebrew-to-english' | 'english-to-hebrew' | 'definition-to-hebrew' | 'example-to-hebrew';

interface Question {
  id: number;
  word: VocabularyWord;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  isRTL: boolean; // Track if the answer options should be RTL
}

interface QuizGameProps {
  items: VocabularyWord[];
  onClose: () => void;
  selectedQuestionTypes?: QuestionType[];
}

export default function QuizGame({ items, onClose, selectedQuestionTypes }: QuizGameProps) {
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);

  // Helper function to detect Hebrew text
  const isHebrewText = (text: string): boolean => {
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text);
  };

  // Helper function to shuffle array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Generate wrong options for multiple choice
  const generateWrongOptions = (correctAnswer: string, allWords: VocabularyWord[], type: QuestionType): string[] => {
    let wrongOptions: string[] = [];
    
    if (type === 'hebrew-to-english') {
      // For Hebrew to English, wrong options are other English words
      wrongOptions = allWords
        .filter(word => word.word !== correctAnswer)
        .map(word => word.word);
    } else {
      // For other types, wrong options are other Hebrew translations
      wrongOptions = allWords
        .filter(word => word.hebrewTranslation !== correctAnswer)
        .map(word => word.hebrewTranslation);
    }
    
    // Shuffle and take 3 random wrong options
    const shuffled = shuffleArray(wrongOptions);
    return shuffled.slice(0, 3);
  };

  // Create a question object
  const createQuestion = (word: VocabularyWord, index: number, type: QuestionType): Question => {
    let question = '';
    let correctAnswer = '';
    let isRTL = false;
    
    switch (type) {
      case 'hebrew-to-english':
        question = `What is the English translation of:`;
        correctAnswer = word.word;
        isRTL = false; // English answers
        break;
      case 'english-to-hebrew':
        question = `What is the Hebrew translation of:`;
        correctAnswer = word.hebrewTranslation;
        isRTL = true; // Hebrew answers
        break;
      case 'definition-to-hebrew':
        question = `Which Hebrew word matches this definition:`;
        correctAnswer = word.hebrewTranslation;
        isRTL = true; // Hebrew answers
        break;

    }

    const wrongOptions = generateWrongOptions(correctAnswer, items, type);
    const allOptions = shuffleArray([...wrongOptions, correctAnswer]);

    return {
      id: index,
      word,
      type,
      question,
      options: allOptions,
      correctAnswer,
      isRTL
    };
  };

  // Initialize quiz
  useEffect(() => {
    if (items.length === 0) {
      setIsFinished(true);
      return;
    }

    // Take up to 7 words for the quiz
    const quizWords = items.length > 7 ? shuffleArray(items).slice(0, 7) : items;
    
    // Available question types
    const availableTypes: QuestionType[] = selectedQuestionTypes && selectedQuestionTypes.length > 0 
      ? selectedQuestionTypes 
      : ['hebrew-to-english', 'english-to-hebrew', 'definition-to-hebrew', 'example-to-hebrew'];

    // Generate questions
    const newQuestions: Question[] = quizWords.map((word, index) => {
      // Cycle through available question types
      const typeIndex = index % availableTypes.length;
      const questionType = availableTypes[typeIndex];
      return createQuestion(word, index, questionType);
    });

    setQuestions(newQuestions);
  }, [items, selectedQuestionTypes]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === questions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
      setStreak(streak + 1);
      if (streak + 1 >= 3) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
      }
    } else {
      setStreak(0);
    }
  };

  // Handle next question
  const handleNext = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setIsFinished(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    }
  };

  // Handle restart
  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setIsFinished(false);
    setStreak(0);
    
    // Regenerate questions with new order
    const quizWords = items.length > 7 ? shuffleArray(items).slice(0, 7) : items;
    const availableTypes: QuestionType[] = selectedQuestionTypes && selectedQuestionTypes.length > 0 
      ? selectedQuestionTypes 
      : ['hebrew-to-english', 'english-to-hebrew', 'definition-to-hebrew', 'example-to-hebrew'];

    const newQuestions: Question[] = quizWords.map((word, index) => {
      const typeIndex = index % availableTypes.length;
      const questionType = availableTypes[typeIndex];
      return createQuestion(word, index, questionType);
    });

    setQuestions(newQuestions);
  };

  // No words case
  if (items.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 my-8">
            <div className="text-center">
              <div className="text-8xl mb-6 animate-bounce">📚</div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                No Words Available
              </h2>
              <p className="text-gray-600 mb-8 text-lg">Please select some words to start the quiz.</p>
              <button
                onClick={onClose}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Finished state
  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    let emoji = '📚';
    let color = 'text-gray-600';
    let bgGradient = 'from-gray-400 to-gray-600';
    
    if (percentage === 100) { emoji = '🏆'; color = 'text-yellow-600'; bgGradient = 'from-yellow-400 to-yellow-600'; }
    else if (percentage >= 90) { emoji = '🎉'; color = 'text-green-600'; bgGradient = 'from-green-400 to-green-600'; }
    else if (percentage >= 80) { emoji = '🌟'; color = 'text-blue-600'; bgGradient = 'from-blue-400 to-blue-600'; }
    else if (percentage >= 70) { emoji = '👏'; color = 'text-purple-600'; bgGradient = 'from-purple-400 to-purple-600'; }
    else if (percentage >= 60) { emoji = '👍'; color = 'text-indigo-600'; bgGradient = 'from-indigo-400 to-indigo-600'; }

    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl border border-gray-100 relative overflow-hidden my-8">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl transition-colors z-10"
            >
              ×
            </button>
            
            {/* Confetti Effect */}
            {percentage >= 80 && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-3 h-3 bg-gradient-to-r ${bgGradient} rounded-full animate-bounce`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>
            )}
            
            <div className="text-center relative z-10">
              <div className="text-8xl mb-6 animate-pulse">{emoji}</div>
              <h2 className={`text-4xl font-bold mb-6 bg-gradient-to-r ${bgGradient} bg-clip-text text-transparent`}>
                Quiz Complete!
              </h2>
              <div className="relative mb-6">
                <div className="text-6xl font-bold mb-2">{score}</div>
                <div className="text-2xl text-gray-400">out of {questions.length}</div>
                <div className={`text-3xl font-bold ${color} mb-4`}>{percentage}%</div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleRestart}
                  className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
                >
                  🔄 Play Again
                </button>
                <button
                  onClick={onClose}
                  className="px-8 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 font-semibold shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (questions.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm overflow-y-auto">
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100 my-8">
            <div className="text-center">
              <div className="text-6xl mb-6 animate-spin">⏳</div>
              <p className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Loading quiz...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + (showAnswer ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm overflow-y-auto">
      {/* Confetti for streak */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          ))}
        </div>
      )}
      
      <div className="min-h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 relative my-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl transition-colors"
          >
            ×
          </button>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">Question {currentQuestionIndex + 1}</span>
                <span className="text-gray-400">of {questions.length}</span>
              </div>
              <div className="flex items-center gap-4">
                {streak > 0 && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-100 to-red-100 rounded-full">
                    <span className="text-orange-500">🔥</span>
                    <span className="font-bold text-orange-600">{streak}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span className="font-semibold text-green-600">{score}</span>
                </div>
              </div>
            </div>
            
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl mb-4">
                <span className="text-2xl">
                  {currentQuestion.type === 'hebrew-to-english' ? '🇮🇱➡️🇬🇧' :
                   currentQuestion.type === 'english-to-hebrew' ? '🇬🇧➡️🇮🇱' :
                   currentQuestion.type === 'definition-to-hebrew' ? '📖➡️🇮🇱' : '💬➡️🇮🇱'}
                </span>
                <h3 className="text-xl font-semibold text-gray-700">{currentQuestion.question}</h3>
              </div>
              
              <div className={`text-4xl font-bold mb-4 p-6 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 ${
                currentQuestion.type === 'hebrew-to-english' ? 'text-right' : 
                isHebrewText(currentQuestion.type === 'english-to-hebrew' ? currentQuestion.word.word : 
                            currentQuestion.type === 'definition-to-hebrew' ? currentQuestion.word.definition : 
                            currentQuestion.word.example) ? 'text-right' : 'text-left'
              }`}>
                {currentQuestion.type === 'hebrew-to-english' ? currentQuestion.word.hebrewTranslation :
                 currentQuestion.type === 'english-to-hebrew' ? currentQuestion.word.word :
                 currentQuestion.type === 'definition-to-hebrew' ? currentQuestion.word.definition :
                 currentQuestion.word.example}
              </div>
              
              {/* Hint */}
              {(currentQuestion.type === 'definition-to-hebrew' || currentQuestion.type === 'example-to-hebrew') && (
                <div className="text-sm text-gray-500 italic">
                  💡 Hint: {currentQuestion.word.word}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, index) => {
                let buttonClass = "w-full p-6 border-3 rounded-2xl transition-all duration-300 font-semibold text-lg relative overflow-hidden ";
                
                if (showAnswer) {
                  if (option === currentQuestion.correctAnswer) {
                    buttonClass += "border-green-500 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 transform scale-105 shadow-lg";
                  } else if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
                    buttonClass += "border-red-500 bg-gradient-to-r from-red-100 to-pink-100 text-red-800 transform scale-95";
                  } else {
                    buttonClass += "border-gray-200 bg-gray-50 text-gray-500";
                  }
                } else {
                  buttonClass += "border-gray-300 bg-gradient-to-r from-white to-gray-50 hover:border-purple-400 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 cursor-pointer transform hover:scale-105 hover:shadow-lg";
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showAnswer}
                    className={buttonClass}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full text-white font-bold text-lg flex items-center justify-center shrink-0 ${
                        showAnswer && option === currentQuestion.correctAnswer ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        showAnswer && option === selectedAnswer && option !== currentQuestion.correctAnswer ? 'bg-gradient-to-r from-red-500 to-pink-500' :
                        'bg-gradient-to-r from-purple-500 to-blue-500'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span 
                        className="flex-1" 
                        style={{ 
                          direction: currentQuestion.isRTL ? 'rtl' : 'ltr',
                          textAlign: currentQuestion.isRTL ? 'right' : 'left'
                        }}
                      >
                        {option}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

         
          {/* Next Button */}
          {showAnswer && (
            <div className="text-center">
              <button
                onClick={handleNext}
                className="px-12 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:from-purple-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-200 font-bold text-xl shadow-lg"
              >
                {currentQuestionIndex + 1 === questions.length ? '🏁 Finish Quiz' : '➡️ Next Question'}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .border-3 {
          border-width: 3px;
        }
      `}</style>
    </div>
  );
}
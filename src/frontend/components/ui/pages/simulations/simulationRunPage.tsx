// app/SimulationStartPage.tsx
'use client';


import QuestionsProgressBar from '@/frontend/components/shared/questionsProgressBar';
import { useState, useEffect, useRef } from 'react';
import QuestionDisplay from './questionDisplay';
import ResultsDisplay from './resultsDispla';
import SimulationHeader from './simulationHeader';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import SimulationReview from './SimulationReview';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};




// Define simulation stages
const SIMULATION_STAGES = [
  { id: 0, name: 'Sentence Completion', questions: 5, timeLimit: 3 * 60 },
  { id: 1, name: 'Sentence Completion', questions: 5, timeLimit: 3 * 60 },
  { id: 2, name: 'Text and Questions', questions: 3, timeLimit: 5 * 60 },
  { id: 3, name: 'Restatement', questions: 4, timeLimit: 4 * 60 },
  { id: 4, name: 'Restatement', questions: 4, timeLimit: 4 * 60 },
  { id: 5, name: 'Sentence Completion', questions: 5, timeLimit: 3 * 60 },
];

// Mock questions for each stage
const mockQuestionsByStage: { [key: number]: Question[] } = {
  0: [
    { id: 1, text: 'The culinary term chiffonade refers to vegetables that have been shredded or __________ into strips.', options: ['sliced', 'sipped', 'stored', 'switched'], correctAnswer: 0 },
    { id: 2, text: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Madrid'], correctAnswer: 0 },
    { id: 3, text: 'What is 2 + 2?', options: ['3', '4', '5', '6'], correctAnswer: 1 },
    { id: 4, text: 'Which planet is closest to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], correctAnswer: 1 },
    { id: 5, text: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], correctAnswer: 3 },
  ],
  1: [
    { id: 6, text: 'The __________ of the story was unexpected.', options: ['ending', 'beginning', 'middle', 'start'], correctAnswer: 0 },
    { id: 7, text: 'She __________ her keys on the table.', options: ['left', 'leave', 'leaving', 'leaves'], correctAnswer: 0 },
    { id: 8, text: 'The weather is __________ today.', options: ['sunny', 'sun', 'sunning', 'sunned'], correctAnswer: 0 },
    { id: 9, text: 'He __________ to the store yesterday.', options: ['went', 'go', 'going', 'goes'], correctAnswer: 0 },
    { id: 10, text: 'The book is __________ interesting.', options: ['very', 'much', 'many', 'lot'], correctAnswer: 0 },
  ],
  2: [
    { id: 11, text: 'Read the following passage and answer the question: "The Industrial Revolution was a period of major industrialization and innovation during the late 18th and early 19th centuries. The Industrial Revolution began in Great Britain and quickly spread to the rest of the world." What was the Industrial Revolution?', options: ['A war', 'A period of industrialization', 'A political movement', 'A religious event'], correctAnswer: 1 },
    { id: 12, text: 'Based on the passage above, where did the Industrial Revolution begin?', options: ['France', 'Germany', 'Great Britain', 'United States'], correctAnswer: 2 },
    { id: 13, text: 'When did the Industrial Revolution occur?', options: ['Early 17th century', 'Late 18th and early 19th centuries', 'Early 20th century', 'Late 19th century'], correctAnswer: 1 },
  ],
  3: [
    { id: 14, text: 'Restate the following: "The cat is on the mat."', options: ['A feline is sitting on a rug', 'The dog is under the chair', 'A cat is lying on the floor', 'The mat has a cat'], correctAnswer: 0 },
    { id: 15, text: 'Restate: "She loves reading books."', options: ['Books are her passion', 'She enjoys literature', 'Reading is her hobby', 'All of the above'], correctAnswer: 3 },
    { id: 16, text: 'Restate: "The weather is cold today."', options: ['It\'s freezing', 'Today is chilly', 'The temperature is low', 'All of the above'], correctAnswer: 3 },
    { id: 17, text: 'Restate: "He works hard every day."', options: ['He is diligent', 'He puts in effort daily', 'He is a hard worker', 'All of the above'], correctAnswer: 3 },
  ],
  4: [
    { id: 18, text: 'Restate: "The movie was entertaining."', options: ['It was fun to watch', 'The film was enjoyable', 'It was amusing', 'All of the above'], correctAnswer: 3 },
    { id: 19, text: 'Restate: "She is very intelligent."', options: ['She is smart', 'She is clever', 'She is bright', 'All of the above'], correctAnswer: 3 },
    { id: 20, text: 'Restate: "The food tastes delicious."', options: ['It\'s yummy', 'It\'s tasty', 'It\'s flavorful', 'All of the above'], correctAnswer: 3 },
    { id: 21, text: 'Restate: "The concert was amazing."', options: ['It was incredible', 'It was fantastic', 'It was wonderful', 'All of the above'], correctAnswer: 3 },
  ],
  5: [
    { id: 22, text: 'The __________ of the movie was excellent.', options: ['acting', 'act', 'acted', 'acts'], correctAnswer: 0 },
    { id: 23, text: 'She __________ her homework before dinner.', options: ['finished', 'finish', 'finishing', 'finishes'], correctAnswer: 0 },
    { id: 24, text: 'The __________ of the book was surprising.', options: ['ending', 'end', 'ended', 'ends'], correctAnswer: 0 },
    { id: 25, text: 'He __________ to school every day.', options: ['walks', 'walk', 'walking', 'walked'], correctAnswer: 0 },
    { id: 26, text: 'The __________ of the story was clear.', options: ['meaning', 'mean', 'meant', 'means'], correctAnswer: 0 },
  ],
};

export default function SimulationRunPage() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number[] }>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(SIMULATION_STAGES[0].timeLimit);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentStageData = SIMULATION_STAGES[currentStage];
  const currentQuestions = mockQuestionsByStage[currentStage] || [];

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isSubmitted]);

  // Reset timer when stage changes
  useEffect(() => {
    setTimeLeft(currentStageData.timeLimit);
    setCurrentQuestion(0);
  }, [currentStage, currentStageData.timeLimit]);

  const handleAnswerSelect = (answerIndex: number): void => {
    if (isSubmitted) return;
    const newAnswers = { ...selectedAnswers };
    if (!newAnswers[currentStage]) newAnswers[currentStage] = [];
    newAnswers[currentStage][currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = (): void => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNextStage = (): void => {
    if (currentStage < SIMULATION_STAGES.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const handlePreviousStage = (): void => {
    if (currentStage > 0) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleSubmit = (): void => {
    setIsReviewing(true);
  };

  const handleConfirmSubmit = (): void => {
    setIsSubmitted(true);
    setIsReviewing(false);
  };

  const handleBackToQuestions = (): void => {
    setIsReviewing(false);
  };

  const handleEditQuestion = (questionIndex: number) => {
    setCurrentQuestion(questionIndex);
    setIsReviewing(false);
  };

  const calculateScore = (): number => {
    let totalCorrect = 0;
    let totalQuestions = 0;

    Object.keys(selectedAnswers).forEach(stageKey => {
      const stage = parseInt(stageKey);
      const questions = mockQuestionsByStage[stage] || [];
      const answers = selectedAnswers[stage] || [];

      questions.forEach((question, index) => {
        totalQuestions++;
        if (question.correctAnswer === answers[index]) {
          totalCorrect++;
        }
      });
    });

    return Math.round((totalCorrect / totalQuestions) * 100);
  };

  const currentStageAnswers = selectedAnswers[currentStage] || [];
  const allQuestionsAnswered = currentQuestions.length > 0 &&
    currentStageAnswers.length === currentQuestions.length &&
    currentStageAnswers.every(answer => answer !== undefined);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Animation for question transitions
  const [fadeKey, setFadeKey] = useState(0);
  useEffect(() => {
    setFadeKey(currentQuestion);
  }, [currentQuestion]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <ResultsDisplay score={calculateScore()} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8" dir="ltr">
      <div className="w-full max-w-4xl mx-auto space-y-4 md:space-y-8">
        <SimulationHeader
          currentStep={currentStage}
          timeRemaining={formatTime(timeLeft)}
          onNextSection={handleNextStage}
        />

        {/* Stage Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6" dir="ltr">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 text-left">
              {currentStageData.name} - Question {currentQuestion + 1} of {currentQuestions.length}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousStage}
                disabled={currentStage === 0}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-600 text-center">
                Stage {currentStage + 1} of {SIMULATION_STAGES.length}
              </span>
              <button
                onClick={handleNextStage}
                disabled={currentStage === SIMULATION_STAGES.length - 1}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Timer progress bar */}
          <div className="w-full flex items-center gap-4 mb-4">
            <div className="flex-1 h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-2 md:h-3 transition-all duration-500 ${timeLeft <= 30 ? 'bg-red-500' : timeLeft <= 60 ? 'bg-yellow-400' : 'bg-blue-500'}`}
                style={{ width: `${(timeLeft / currentStageData.timeLimit) * 100}%` }}
              />
            </div>
            <span className={`font-mono text-sm md:text-lg w-12 md:w-16 text-right ${timeLeft <= 30 ? 'text-red-600' : timeLeft <= 60 ? 'text-yellow-600' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        {isReviewing ? (
          <SimulationReview
            questions={currentQuestions}
            selectedAnswers={currentStageAnswers}
            onEditQuestion={handleEditQuestion}
            onConfirm={handleConfirmSubmit}
            onBack={handleBackToQuestions}
          />
        ) : (
          <div className="space-y-4 md:space-y-8 transition-all duration-500 animate-fade-in-scale" key={fadeKey} dir="ltr">
            <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6">
              <QuestionsProgressBar
                currentQuestion={currentQuestion}
                totalQuestions={currentQuestions.length}
              />

              {/* QuestionDisplay with answer highlight */}
              <div className="transition-all duration-500">
                <QuestionDisplay
                  question={currentQuestions[currentQuestion]}
                  selectedAnswerIndex={currentStageAnswers[currentQuestion]}
                  onAnswerSelect={handleAnswerSelect}
                  isSubmitted={isSubmitted}
                />
              </div>

              {/* Navigation Buttons - Mobile responsive */}
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-6">
                <button
                  className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-gray-500 text-white hover:bg-gray-600'}`}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Previous</span>
                </button>
                <button
                  className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${currentStageAnswers[currentQuestion] === undefined ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                  onClick={handleNext}
                  disabled={currentQuestion === currentQuestions.length - 1 || currentStageAnswers[currentQuestion] === undefined}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${!allQuestionsAnswered ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-green-500 text-white hover:bg-green-600'}`}
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                >
                  <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Review & Submit</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
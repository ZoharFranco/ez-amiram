// app/SimulationStartPage.tsx
'use client';


import QuestionsProgressBar from '@/frontend/components/shared/questionsProgressBar';
import { useState, useEffect, useRef } from 'react';
import QuestionDisplay from './questionDisplay';
import QuestionsNavigationButtons from './questionsNavigation';
import ResultsDisplay from './resultsDispla';
import SimulationHeader from './simulationHeader';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import SimulationReview from './SimulationReview';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

const mockQuestions: Question[] = [
  {
    id: 1,
    text: 'The culinary term chiffonade refers to vegetables that have been shredded or __________ into strips.',
    options: ['sliced', 'sipped', 'stored', 'switched'],
    correctAnswer: 0, // 'sliced'
  },
  {
    id: 2,
    text: 'What is the capital of France?',
    options: ['Paris', 'London', 'Berlin', 'Madrid'],
    correctAnswer: 0,
  },
  {
    id: 3,
    text: 'What is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: 1,
  },
];

const SECTION_TIME_SECONDS = 5 * 60; // 5 minutes per section

export default function SimulationRunPage() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(SECTION_TIME_SECONDS);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isSubmitted) return;
    if (timeLeft <= 0) {
      setIsSubmitted(true);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isSubmitted]);

  // Reset timer on new simulation (if needed)
  useEffect(() => {
    if (!isSubmitted) setTimeLeft(SECTION_TIME_SECONDS);
  }, [isSubmitted]);

  const handleAnswerSelect = (answerIndex: number): void => {
    if (isSubmitted) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = (): void => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
    const correctAnswers = mockQuestions.reduce((acc, question, index) => {
      return acc + (question.correctAnswer === selectedAnswers[index] ? 1 : 0);
    }, 0);
    return Math.round((correctAnswers / mockQuestions.length) * 100);
  };

  const allQuestionsAnswered = selectedAnswers.length === mockQuestions.length &&
    selectedAnswers.every(answer => answer !== undefined);

  // For the header, we'll need to manually track which step we are on
  const headerCurrentStep = 2; // Assuming "Text and Questions" is step 3 (index 2) as per image
  const headerTotalSteps = 6; // Total steps visible in the header tabs

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Dummy function for next section in header
  const handleNextSection = () => {
    console.log("Next section clicked!");
    // Implement actual logic for moving to the next section of the exam
  };

  // Animation for question transitions
  const [fadeKey, setFadeKey] = useState(0);
  useEffect(() => {
    setFadeKey(currentQuestion);
  }, [currentQuestion]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <SimulationHeader
          currentStep={headerCurrentStep}
          totalSteps={headerTotalSteps}
          timeRemaining={formatTime(timeLeft)}
          onNextSection={handleNextSection}
        />

        {/* Timer progress bar */}
        {!isSubmitted && (
          <div className="w-full flex items-center gap-4 mb-2">
            <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-3 transition-all duration-500 ${timeLeft <= 30 ? 'bg-red-500' : timeLeft <= 60 ? 'bg-yellow-400' : 'bg-blue-500'}`}
                style={{ width: `${(timeLeft / SECTION_TIME_SECONDS) * 100}%` }}
              />
            </div>
            <span className={`font-mono text-lg w-16 text-right ${timeLeft <= 30 ? 'text-red-600' : timeLeft <= 60 ? 'text-yellow-600' : 'text-gray-700'}`}>{formatTime(timeLeft)}</span>
          </div>
        )}

        {!isSubmitted && isReviewing ? (
          <SimulationReview
            questions={mockQuestions}
            selectedAnswers={selectedAnswers}
            onEditQuestion={handleEditQuestion}
            onConfirm={handleConfirmSubmit}
            onBack={handleBackToQuestions}
          />
        ) : !isSubmitted ? (
          <div className="space-y-8 transition-all duration-500 animate-fade-in-scale" key={fadeKey}>
            <div className="bg-white/90 rounded-2xl shadow-xl p-6">
              <QuestionsProgressBar
                currentQuestion={currentQuestion}
                totalQuestions={mockQuestions.length}
              />

              {/* QuestionDisplay with answer highlight */}
              <div className="transition-all duration-500">
                <QuestionDisplay
                  question={mockQuestions[currentQuestion]}
                  selectedAnswerIndex={selectedAnswers[currentQuestion]}
                  onAnswerSelect={handleAnswerSelect}
                  isSubmitted={isSubmitted}
                />
              </div>

              {/* Navigation Buttons with improved interactivity and icons */}
              <div className="flex justify-center mt-6">
                <button
                  className={`btn btn-secondary mx-2 px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2 ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeftIcon className="w-5 h-5" /> Previous
                </button>
                <button
                  className={`btn btn-primary mx-2 px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2 ${selectedAnswers[currentQuestion] === undefined ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                  onClick={handleNext}
                  disabled={currentQuestion === mockQuestions.length - 1 || selectedAnswers[currentQuestion] === undefined}
                >
                  Next <ArrowRightIcon className="w-5 h-5" />
                </button>
                <button
                  className={`btn btn-success mx-2 px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center gap-2 ${!allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'}`}
                  onClick={handleSubmit}
                  disabled={!allQuestionsAnswered}
                >
                  <CheckCircleIcon className="w-5 h-5" /> Review & Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <ResultsDisplay score={calculateScore()} />
        )}
      </div>
    </div>
  );
}
// app/SimulationStartPage.tsx
'use client';


import QuestionsProgressBar from '@/frontend/components/shared/questionsProgressBar';
import { useState } from 'react';
import QuestionDisplay from './questionDisplay';
import QuestionsNavigationButtons from './questionsNavigation';
import ResultsDisplay from './resultsDispla';
import SimulationHeader from './simulationHeader';

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

export default function SimulationRunPage() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

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
    setIsSubmitted(true);
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

  // Dummy time for header
  const timeRemaining = "03:22";

  // Dummy function for next section in header
  const handleNextSection = () => {
    console.log("Next section clicked!");
    // Implement actual logic for moving to the next section of the exam
  };


  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        <SimulationHeader
          currentStep={headerCurrentStep}
          totalSteps={headerTotalSteps}
          timeRemaining={timeRemaining}
          onNextSection={handleNextSection}
        />

        {!isSubmitted ? (
          <div className="space-y-8">
            <QuestionsProgressBar
              currentQuestion={currentQuestion}
              totalQuestions={mockQuestions.length}
            />

            <QuestionDisplay
              question={mockQuestions[currentQuestion]}
              selectedAnswerIndex={selectedAnswers[currentQuestion]}
              onAnswerSelect={handleAnswerSelect}
              isSubmitted={isSubmitted}
            />

            <QuestionsNavigationButtons
              currentQuestionIndex={currentQuestion}
              totalQuestions={mockQuestions.length}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onSubmit={handleSubmit}
              isAnswerSelected={selectedAnswers[currentQuestion] !== undefined}
              allQuestionsAnswered={allQuestionsAnswered}
            />
          </div>
        ) : (
          <ResultsDisplay score={calculateScore()} />
        )}
      </div>
    </div>
  );
}
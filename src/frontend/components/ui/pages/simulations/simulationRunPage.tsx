// app/SimulationStartPage.tsx
'use client';


import { useState, useEffect, useRef } from 'react';
import QuestionsProgressBar from '@/frontend/components/shared/questionsProgressBar';
import QuestionDisplay from './questionDisplay';
import ResultsDisplay from './resultsDispla';
import SimulationHeader from './simulationHeader';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Simulation from '@/lib/types/simulation';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/frontend/hooks/use-auth';
import { db } from '@/backend/services/external/firebase/firebase';
import { useSimulationStore } from '@/frontend/stores/simulation-store';

interface SimulationRunPageProps {
  simulation: Simulation;
}

export default function SimulationRunPage({ simulation }: SimulationRunPageProps) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [currentQuestionInStage, setCurrentQuestionInStage] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(simulation.stages?.[0]?.timeInSeconds || 0);
  const [userAnswersByStage, setUserAnswersByStage] = useState<{ [stageIdx: number]: number[] }>(() => {
    const initial: { [stageIdx: number]: number[] } = {};
    simulation.stages?.forEach((stage, idx) => {
      initial[idx] = Array(stage.questions?.length || 0).fill(undefined);
    });
    return initial;
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [submittedStages, setSubmittedStages] = useState<boolean[]>(() => simulation.stages?.map(() => false) || []);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const saveSimulationResult = useSimulationStore(state => state.saveSimulationResult);

  useEffect(() => {
    setTimeLeft(simulation.stages?.[currentStage]?.timeInSeconds || 0);
  }, [currentStage, simulation.stages]);

  useEffect(() => {
    if (isSubmitted || isReviewing) return;
    if (timeLeft <= 0) {
      handleStageTimeout();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isSubmitted, isReviewing]);

  const handleAnswerSelect = (answerIndex: number): void => {
    if (isSubmitted || isReviewing) return;
    setUserAnswersByStage(prev => {
      const updated = { ...prev };
      updated[currentStage] = [...updated[currentStage]];
      updated[currentStage][currentQuestionInStage] = answerIndex;
      return updated;
    });
  };

  const handleNext = (): void => {
    const stageQuestions = simulation.stages?.[currentStage]?.questions || [];
    if (currentQuestionInStage < stageQuestions.length - 1) {
      setCurrentQuestionInStage(currentQuestionInStage + 1);
    } else if (currentStage < (simulation.stages?.length || 0) - 1) {
      setCurrentStage(currentStage + 1);
      setCurrentQuestionInStage(0);
    }
  };

  const handlePrevious = (): void => {
    if (currentQuestionInStage > 0) {
      setCurrentQuestionInStage(currentQuestionInStage - 1);
    } else if (currentStage > 0) {
      const prevStage = currentStage - 1;
      setCurrentStage(prevStage);
      setCurrentQuestionInStage((simulation.stages?.[prevStage]?.questions?.length || 1) - 1);
    }
  };

  const handleStageTimeout = () => {
    if (currentStage < (simulation.stages?.length || 0) - 1) {
      setCurrentStage(currentStage + 1);
      setCurrentQuestionInStage(0);
    } else {
      setIsReviewing(true);
    }
  };

  const calculateScore = (): number => {
    let totalCorrect = 0;
    let totalQuestions = 0;
    for (const stageIdx in userAnswersByStage) {
      const questions = simulation.stages?.[stageIdx]?.questions || [];
      const answers = userAnswersByStage[stageIdx] || [];
      totalQuestions += questions.length;
      for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].correctAnswer) {
          totalCorrect++;
        }
      }
    }
    return Math.round((totalCorrect / totalQuestions) * 100);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const stage = simulation.stages?.[currentStage];
  const questions = stage?.questions || [];
  const userAnswers = userAnswersByStage[currentStage] || [];

  // Only allow navigation within the current stage until it is submitted
  const canGoBack = currentQuestionInStage > 0 && !submittedStages[currentStage];
  const canGoNext = currentQuestionInStage < questions.length - 1 && !submittedStages[currentStage];
  const canSubmitStage = userAnswers.every(a => a !== undefined) && !submittedStages[currentStage];

  const handleSimulationFinish = async () => {
    setIsSubmitted(true);
    // Save to backend
    if (user && simulation && db) {
      // Flatten answers by stage
      const allAnswers = Object.values(userAnswersByStage).flat();
      await saveSimulationResult(db, user.uid, simulation.id || 'generated', allAnswers);
    }
  };

  const handleSubmitStage = () => {
    setSubmittedStages(prev => {
      const updated = [...prev];
      updated[currentStage] = true;
      return updated;
    });
    if (currentStage < (simulation.stages?.length || 0) - 1) {
      setCurrentStage(currentStage + 1);
      setCurrentQuestionInStage(0);
    } else {
      handleSimulationFinish();
    }
  };

  const handleNextSection = () => {
    if (!userAnswers.every(a => a !== undefined)) {
      setShowConfirm(true);
    } else {
      handleSubmitStage();
    }
  };

  const handleConfirmNextSection = () => {
    setShowConfirm(false);
    handleSubmitStage();
  };

  // Prevent going back to previous stages after submission
  useEffect(() => {
    if (submittedStages[currentStage]) {
      setCurrentQuestionInStage(0);
    }
  }, [currentStage, submittedStages]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <ResultsDisplay score={calculateScore()} />
          <div className="flex justify-center mt-8">
            <button
              className="btn btn-primary px-8 py-3 text-lg"
              onClick={() => router.push('/frontend/simulations')}
            >
              Back to Simulations
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8" dir="ltr">
      <div className="w-full max-w-4xl mx-auto space-y-4 md:space-y-8">
        <div className="flex items-center mb-4">
          <button
            className="flex items-center gap-2 text-orange-700 hover:text-orange-900 font-semibold px-4 py-2 rounded transition-colors bg-orange-100 hover:bg-orange-200"
            onClick={() => router.replace('/frontend/simulations')}
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Simulations
          </button>
        </div>
        <SimulationHeader
          currentStep={currentStage}
          timeRemaining={formatTime(timeLeft)}
          onNextSection={handleNextSection}
          stages={simulation.stages}
          simulationName={simulation.name}
        />
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6" dir="ltr">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 text-left">
              Stage {currentStage + 1}: {stage?.type} <br />
              Question {currentQuestionInStage + 1} of {questions.length}
            </h2>
          </div>
          {/* Timer progress bar */}
          <div className="w-full flex items-center gap-4 mb-4">
            <div className="flex-1 h-2 md:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-2 md:h-3 transition-all duration-500 ${timeLeft <= 30 ? 'bg-red-500' : timeLeft <= 60 ? 'bg-yellow-400' : 'bg-orange-500'}`}
                style={{ width: `${(timeLeft / (stage?.timeInSeconds || 1)) * 100}%` }}
              />
            </div>
            <span className={`font-mono text-sm md:text-lg w-12 md:w-16 text-right ${timeLeft <= 30 ? 'text-red-600' : timeLeft <= 60 ? 'text-yellow-600' : 'text-gray-700'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="space-y-4 md:space-y-8 transition-all duration-500 animate-fade-in-scale" key={`${currentStage}-${currentQuestionInStage}`} dir="ltr">
          <div className="bg-white/90 rounded-2xl shadow-xl p-4 md:p-6">
            <QuestionsProgressBar
              currentQuestion={currentQuestionInStage}
              totalQuestions={questions.length}
            />
            {/* QuestionDisplay with answer highlight */}
            <div className="transition-all duration-500">
              <QuestionDisplay
                question={questions[currentQuestionInStage]}
                selectedAnswerIndex={userAnswers[currentQuestionInStage]}
                onAnswerSelect={handleAnswerSelect}
                isSubmitted={submittedStages[currentStage]}
              />
            </div>
            {/* Navigation Buttons - Mobile responsive */}
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-6">
              <button
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${!canGoBack ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                onClick={handlePrevious}
                disabled={!canGoBack}
              >
                <ArrowLeftIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              <button
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${!canGoNext ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                onClick={handleNext}
                disabled={!canGoNext}
              >
                <span className="hidden sm:inline">Next</span>
                <ArrowRightIcon className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 ${!canSubmitStage ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500' : 'bg-green-500 text-white hover:bg-green-600'}`}
                onClick={handleSubmitStage}
                disabled={!canSubmitStage}
              >
                <CheckCircleIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Submit Stage</span>
              </button>
              <button
                className={`px-4 md:px-6 py-2 rounded-lg font-semibold shadow transition-all duration-200 flex items-center justify-center gap-2 bg-blue-500 text-white hover:bg-blue-600`}
                onClick={handleNextSection}
                disabled={submittedStages[currentStage]}
              >
                Next Section
              </button>
            </div>
            {showConfirm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
                  <h3 className="text-lg font-bold mb-4 text-orange-700">Not all questions are answered</h3>
                  <p className="mb-6 text-gray-700 text-center">Are you sure you want to submit this stage and move to the next section?</p>
                  <div className="flex gap-4">
                    <button
                      className="btn btn-primary px-6 py-2"
                      onClick={handleConfirmNextSection}
                    >
                      Yes, Continue
                    </button>
                    <button
                      className="btn btn-secondary px-6 py-2"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// components/NavigationButtons.tsx
import React from 'react';

type QuestionsNavigationButtonsProps = {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isAnswerSelected: boolean;
  allQuestionsAnswered: boolean;
};

const QuestionsNavigationButtons: React.FC<QuestionsNavigationButtonsProps> = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
  isAnswerSelected,
  allQuestionsAnswered,
}) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex justify-between gap-4 mt-4">
      <button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-semibold"
      >
        Previous
      </button>
      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={!allQuestionsAnswered} // Disable if not all questions are answered
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-600 transition-colors font-semibold shadow-lg"
        >
          Submit
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!isAnswerSelected} // Disable if current question is not answered
          className="flex-1 bg-blue-600 text-white rounded-xl py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-semibold shadow-lg"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default QuestionsNavigationButtons;
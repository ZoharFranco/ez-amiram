// components/QuestionDisplay.tsx
import React from 'react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

type QuestionDisplayProps = {
  question: Question;
  selectedAnswerIndex?: number; // Make it optional
  onAnswerSelect: (answerIndex: number) => void;
  isSubmitted: boolean;
};

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswerIndex,
  onAnswerSelect,
  isSubmitted,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        {question.text}
      </h2>
      <div className="flex flex-col gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswerIndex === index;
          return (
            <button
              key={index}
              className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400
                ${isSelected
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'}
              `}
              onClick={() => onAnswerSelect(index)}
              tabIndex={0}
              disabled={isSubmitted} // Disable selection after submission
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
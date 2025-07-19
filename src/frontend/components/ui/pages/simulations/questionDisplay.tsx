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
    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 animate-fade-in-scale">
      {/* Motivational message */}
      <div className="mb-2 text-emerald-600 font-semibold text-base animate-pulse">
        {isSubmitted ? 'Review your answers below!' : 'You can do it! Choose the best answer.'}
      </div>
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
                  ? 'border-blue-600 bg-blue-100 text-blue-900 shadow-lg scale-[1.03] ring-2 ring-blue-300'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:scale-[1.01]'}
                ${isSubmitted ? 'cursor-default opacity-80' : 'cursor-pointer'}
              `}
              style={{ transition: 'box-shadow 0.2s, background 0.2s, transform 0.15s' }}
              onClick={() => onAnswerSelect(index)}
              tabIndex={0}
              disabled={isSubmitted}
            >
              <span className="transition-colors duration-200">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
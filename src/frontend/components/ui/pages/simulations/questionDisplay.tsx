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
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col gap-4 md:gap-6 animate-fade-in-scale" dir="ltr">
      {/* Motivational message */}
      <div className="mb-2 text-emerald-600 font-semibold text-sm md:text-base animate-pulse text-left">
        {isSubmitted ? 'Review your answers below!' : 'You can do it! Choose the best answer.'}
      </div>
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2 leading-relaxed text-left">
        {question.text}
      </h2>
      <div className="flex flex-col gap-3 md:gap-4">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswerIndex === index;
          return (
            <button
              key={index}
              className={`w-full text-left px-4 md:px-6 py-3 md:py-4 rounded-xl border transition-all duration-200 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 min-h-[48px] md:min-h-[56px]
                ${isSelected
                  ? 'border-blue-600 bg-blue-100 text-blue-900 shadow-lg scale-[1.02] ring-2 ring-blue-300'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:scale-[1.01]'}
                ${isSubmitted ? 'cursor-default opacity-80' : 'cursor-pointer'}
              `}
              style={{ transition: 'box-shadow 0.2s, background 0.2s, transform 0.15s', textAlign: 'left' }}
              onClick={() => onAnswerSelect(index)}
              tabIndex={0}
              disabled={isSubmitted}
            >
              <span className="transition-colors duration-200 leading-relaxed text-left">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;
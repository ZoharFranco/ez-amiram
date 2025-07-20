import React from 'react';

type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
};

type SimulationReviewProps = {
  questions: Question[];
  selectedAnswers: number[];
  onEditQuestion: (questionIndex: number) => void;
  onConfirm: () => void;
  onBack: () => void;
};

const SimulationReview: React.FC<SimulationReviewProps> = ({
  questions,
  selectedAnswers,
  onEditQuestion,
  onConfirm,
  onBack,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 animate-fade-in-scale" dir="ltr">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 text-left">Review Your Answers</h2>
      <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-3 md:p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 bg-gray-50 flex flex-col gap-2"
          >
            <div className="flex items-start gap-2 mb-1">
              <span className="font-semibold text-gray-700 text-sm md:text-base text-left">Q{idx + 1}:</span>
              <span className="text-gray-900 text-sm md:text-base flex-1 leading-relaxed text-left">{q.text}</span>
              <button
                className="ml-auto text-blue-600 hover:underline text-xs md:text-sm font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors text-left"
                onClick={() => onEditQuestion(idx)}
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, oidx) => (
                <span
                  key={oidx}
                  className={`px-2 md:px-3 py-1 rounded-lg border text-xs md:text-sm font-medium transition-all duration-200 text-left
                    ${selectedAnswers[idx] === oidx
                      ? 'bg-blue-100 border-blue-500 text-blue-900 shadow'
                      : 'bg-white border-gray-200 text-gray-600'}
                  `}
                >
                  {opt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4">
        <button
          className="px-4 md:px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition-all duration-200 text-sm md:text-base text-left bg-gray-500 text-white hover:bg-gray-600"
          onClick={onBack}
        >
          Back to Questions
        </button>
        <button
          className="px-4 md:px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition-all duration-200 text-sm md:text-base text-left bg-green-500 text-white"
          onClick={onConfirm}
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
};

export default SimulationReview; 
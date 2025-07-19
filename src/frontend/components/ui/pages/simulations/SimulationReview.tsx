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
    <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-scale">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Review Your Answers</h2>
      <div className="space-y-6 mb-8">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 bg-gray-50 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-700">Q{idx + 1}:</span>
              <span className="text-gray-900">{q.text}</span>
              <button
                className="ml-auto text-blue-600 hover:underline text-sm font-medium"
                onClick={() => onEditQuestion(idx)}
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {q.options.map((opt, oidx) => (
                <span
                  key={oidx}
                  className={`px-3 py-1 rounded-lg border text-sm font-medium transition-all duration-200
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
      <div className="flex justify-end gap-4">
        <button
          className="btn btn-secondary px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-200 transition-all duration-200"
          onClick={onBack}
        >
          Back to Questions
        </button>
        <button
          className="btn btn-success px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition-all duration-200"
          onClick={onConfirm}
        >
          Confirm & Submit
        </button>
      </div>
    </div>
  );
};

export default SimulationReview; 
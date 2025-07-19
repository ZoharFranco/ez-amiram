// components/ProgressBar.tsx
import React from 'react';

type ProgressBarProps = {
  currentQuestion: number;
  totalQuestions: number;
};

const QuestionsProgressBar: React.FC<ProgressBarProps> = ({ currentQuestion, totalQuestions }) => {
  const percent = Math.round(((currentQuestion + 1) / totalQuestions) * 100);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 font-medium tracking-wide">
          Question {currentQuestion + 1} / {totalQuestions}
        </span>
        <span className="text-xs text-blue-600 font-semibold">{percent}%</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default QuestionsProgressBar;
// components/ResultsDisplay.tsx
import React from 'react';

type ResultsDisplayProps = {
  score: number;
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ score }) => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl shadow-xl p-10 text-center flex flex-col items-center">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" />
          </svg>
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
          {score}%
        </h2>
        <p className="text-lg text-white/90 mb-6 font-medium">
          Simulation Complete!
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
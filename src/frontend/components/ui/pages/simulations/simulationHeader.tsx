// components/Header.tsx
import React from 'react';

type SimulationHeaderProps = {
  currentStep: number;
  totalSteps: number;
  timeRemaining: string; // e.g., "03:22"
  onNextSection: () => void;
};

const SimulationHeader: React.FC<SimulationHeaderProps> = ({ currentStep, totalSteps, timeRemaining, onNextSection }) => {
  return (
    <div className="bg-white shadow-md py-3 px-4 md:py-4 md:px-6 flex flex-col md:flex-row items-center justify-between rounded-t-xl gap-2 md:gap-0">
      <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 w-full md:w-auto">
        <div className="text-blue-700 font-bold text-lg md:text-xl">AMIRnet®</div>
        <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide"> {/* Added overflow-x-auto for tabs */}
          {['Sentence Completion', 'Sentence Completion', 'Text and Questions', 'Restatement', 'Restatement', 'Sentence Completion'].map((label, index) => (
            <div
              key={label + index}
              className={`px-3 py-1 text-xs md:text-sm font-medium rounded-full whitespace-nowrap cursor-pointer transition-colors duration-200
                ${index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-3 md:gap-4 w-full md:w-auto mt-2 md:mt-0">
        <div className="flex items-center gap-1 md:gap-2 text-gray-700">
          <span className="text-sm">⏱️</span>
          <span className="text-base md:text-lg font-semibold">{timeRemaining}</span>
        </div>
        <button
          onClick={onNextSection}
          className="bg-blue-600 text-white px-4 py-1.5 md:px-6 md:py-2 rounded-lg text-sm md:text-base font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          Next Section &gt;
        </button>
      </div>
    </div>
  );
};

export default SimulationHeader;
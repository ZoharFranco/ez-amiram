'use client';

import '@/frontend/components/ChartSetup';

import { useState } from 'react';


type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
};

type SimulationStartProps = {
    mode: 'todo' | 'finished';
    questions?: Question[];
    userAnswers?: number[];
    score?: number;
};

const mockQuestions: Question[] = [
    {
        id: 1,
        text: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Madrid'],
        correctAnswer: 0,
    },
    {
        id: 2,
        text: 'What is 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
    },
];

export default function SimulationStart({ mode, questions = mockQuestions, userAnswers = [], score }: SimulationStartProps) {
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(userAnswers);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(mode === 'finished');

    const handleAnswerSelect = (answerIndex: number): void => {
        if (mode === 'finished') return;
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = (): void => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = (): void => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = (): void => {
        setIsSubmitted(true);
    };

    const calculateScore = (): number => {
        const correctAnswers = questions.reduce((acc, question, index) => {
            return acc + (question.correctAnswer === selectedAnswers[index] ? 1 : 0);
        }, 0);
        return Math.round((correctAnswers / questions.length) * 100);
    };

    const percent: number = Math.round(((currentQuestion + 1) / questions.length) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!isSubmitted ? (
                <div className="space-y-8">
                    {/* Progress Indicator */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-500 font-medium tracking-wide">
                                Question {currentQuestion + 1} / {questions.length}
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

                    {/* Question Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            {questions[currentQuestion].text}
                        </h2>
                        <div className="flex flex-col gap-4">
                            {questions[currentQuestion].options.map((option, index) => {
                                const isSelected: boolean = selectedAnswers[currentQuestion] === index;
                                return (
                                    <button
                                        key={index}
                                        className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-400
                                            ${isSelected
                                                ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-md'
                                                : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'}
                                        `}
                                        onClick={() => handleAnswerSelect(index)}
                                        tabIndex={0}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between gap-4 mt-4">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestion === 0}
                            className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Previous
                        </button>
                        {currentQuestion === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedAnswers.length !== questions.length}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-600 transition-colors font-semibold shadow-lg"
                            >
                                Submit
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={selectedAnswers[currentQuestion] === undefined}
                                className="flex-1 bg-blue-600 text-white rounded-xl py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                // Results View
                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-blue-500 to-green-400 rounded-2xl shadow-xl p-10 text-center flex flex-col items-center">
                        <div className="flex items-center justify-center mb-4">
                            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2l4-4" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg">
                            {typeof score === 'number' ? score : calculateScore()}%
                        </h2>
                        <p className="text-lg text-white/90 mb-6 font-medium">
                            Simulation Complete!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
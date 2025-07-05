'use client';

import PageTitle from '@/frontend/components/PageTitle';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { ArrowLeftIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Question = {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
};

export default function Simulation() {
    const router = useRouter();
    const { t, currentLanguage } = useLanguage();
    const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Example questions (replace with real content)
    const questions: Question[] = [
        {
            id: 1,
            text: t('pages.simulation.questions.q1.text'),
            options: [
                t('pages.simulation.questions.q1.options.a'),
                t('pages.simulation.questions.q1.options.b'),
                t('pages.simulation.questions.q1.options.c'),
                t('pages.simulation.questions.q1.options.d'),
            ],
            correctAnswer: 0,
        },
        // Add more questions here
    ];

    const handleAnswerSelect = (answerIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestion] = answerIndex;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const calculateScore = () => {
        const correctAnswers = questions.reduce((acc, question, index) => {
            return acc + (question.correctAnswer === selectedAnswers[index] ? 1 : 0);
        }, 0);
        return Math.round((correctAnswers / questions.length) * 100);
    };

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-gray-50">
            <header className="sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <PageTitle title={t('pages.simulation.title')} />
                    <div className="w-6" /> {/* Spacer for alignment */}
                </div>
            </header>

            <main className="px-4 py-6 max-w-3xl mx-auto">
                {!isSubmitted ? (
                    <div className="space-y-6">
                        {/* Progress Indicator */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-label text-gray-600">
                                    {t('pages.simulation.questionNumber')} {currentQuestion + 1} / {questions.length}
                                </span>
                                <BookOpenIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 transition-all duration-500"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-title text-gray-900 mb-6">
                                {questions[currentQuestion].text}
                            </h2>
                            <div className="space-y-3">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`w-full text-start p-4 rounded-lg border ${selectedAnswers[currentQuestion] === index
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                                            } transition-all duration-200`}
                                        onClick={() => handleAnswerSelect(index)}
                                    >
                                        <span className="text-body text-gray-900">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between gap-4">
                            <button
                                onClick={handlePrevious}
                                disabled={currentQuestion === 0}
                                className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                {t('pages.simulation.previous')}
                            </button>
                            {currentQuestion === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={selectedAnswers.length !== questions.length}
                                    className="flex-1 bg-blue-600 text-white rounded-lg py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                >
                                    {t('pages.simulation.submit')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleNext}
                                    disabled={selectedAnswers[currentQuestion] === undefined}
                                    className="flex-1 bg-blue-600 text-white rounded-lg py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                >
                                    {t('pages.simulation.next')}
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    // Results View
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                            <div className="flex justify-center mb-4">
                                <CheckCircleIcon className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-display text-gray-900 mb-2">
                                {calculateScore()}%
                            </h2>
                            <p className="text-body text-gray-600 mb-6">
                                {t('pages.simulation.completionMessage')}
                            </p>
                            <button
                                onClick={() => router.push('/')}
                                className="w-full bg-blue-600 text-white rounded-lg py-3 px-4 hover:bg-blue-700 transition-colors"
                            >
                                {t('pages.simulation.backToHome')}
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
} 
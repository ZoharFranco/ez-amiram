'use client';

import PageTitle from '@/frontend/components/PageTitle';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { ArrowLeftIcon, BoltIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';



function QuickLearn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, currentLanguage } = useLanguage();
    const isRTL = currentLanguage === 'he' || currentLanguage === 'ar';

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [completedTasks, setCompletedTasks] = useState<number>(0);

    // Get the duration from URL params (in minutes)
    const durationMinutes = parseInt(searchParams.get('duration') || '15');

    useEffect(() => {
        setTimeLeft(durationMinutes * 60); // Convert minutes to seconds
    }, [durationMinutes]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startSession = () => {
        setIsActive(true);
    };

    const completeTask = () => {
        setCompletedTasks(prev => prev + 1);
    };

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[rgb(var(--color-background))]">
            <header className="sticky top-0 glass z-10 border-b border-gray-100/50">
                <div className="px-6 py-4 flex items-center justify-between max-w-5xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="text-[rgb(var(--color-text-light))] hover:text-[rgb(var(--color-text))] transition-colors"
                    >
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <PageTitle title={t('pages.quickLearn.title')} />
                    <div className="badge badge-primary">
                        <BoltIcon className="w-5 h-5" />
                    </div>
                </div>
            </header>

            <main className="px-6 py-8 max-w-5xl mx-auto">
                {/* Timer Display */}
                <div className="card p-8 mb-8 gradient-animate">
                    <div className="relative z-10">
                        <div className="flex flex-col items-center text-center">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <SparklesIcon className="w-8 h-8 text-white" />
                                </div>
                                <svg className="w-32 h-32 transform -rotate-90">
                                    <circle
                                        className="text-white/20"
                                        strokeWidth="6"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="58"
                                        cx="64"
                                        cy="64"
                                    />
                                    <circle
                                        className="text-white"
                                        strokeWidth="6"
                                        strokeDasharray={364}
                                        strokeDashoffset={364 - (364 * timeLeft) / (durationMinutes * 60)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="58"
                                        cx="64"
                                        cy="64"
                                    />
                                </svg>
                            </div>
                            <span className="text-display text-white mb-2">
                                {formatTime(timeLeft)}
                            </span>
                            {!isActive && (
                                <button
                                    onClick={startSession}
                                    className="btn btn-secondary mt-6 w-full max-w-sm"
                                >
                                    {t('pages.quickLearn.startSession')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Learning Content */}
                {isActive && (
                    <div className="space-y-8">
                        <div className="card p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-title">
                                    {t('pages.quickLearn.currentTask')}
                                </h2>
                                <div className="badge badge-accent">
                                    <CheckCircleIcon className="w-4 h-4 inline-block mr-1" />
                                    <span>{completedTasks} completed</span>
                                </div>
                            </div>
                            <p className="text-body text-[rgb(var(--color-text-light))] mb-6">
                                {t('pages.quickLearn.taskDescription')}
                            </p>
                            <button
                                onClick={completeTask}
                                className="btn btn-primary w-full"
                            >
                                Complete Task
                            </button>
                        </div>

                        <div className="card p-8">
                            <h2 className="text-title mb-6">
                                {t('pages.quickLearn.progress')}
                            </h2>
                            <div className="progress-bar">
                                <div
                                    className="progress-bar-fill"
                                    style={{
                                        width: `${((durationMinutes * 60 - timeLeft) / (durationMinutes * 60)) * 100}%`
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
} 


export default function QuickLearnPage() {
    return (
        // You could have a loading skeleton as the `fallback` too
        <Suspense>
            <QuickLearn />
        </Suspense>
    )
}
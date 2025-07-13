'use client';

import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { ArrowLeftIcon } from 'lucide-react';
import { useState } from 'react';
import ProgressBar from '../../../frontend/components/shared/progressBar';

interface SubjectCategory {
    title: string;
    description: string;
    icon: string;
    topics: string[];
}

export default function QuestionsPage() {
    const { t } = useLanguage();

    const [mockCompletedTopics] = useState<Record<number, number>>({
        0: 2,
        1: 0,
        2: 3,
    });

    const subjects: SubjectCategory[] = [
        {
            title: t('pages.subjects.restatement.title'),
            description: t('pages.subjects.restatement.description'),
            icon: '📖',
            topics: ['Tenses', 'Articles', 'Prepositions', 'Conditionals'],
        },
        {
            title: t('pages.subjects.sentenceCompletion.title'),
            description: t('pages.subjects.sentenceCompletion.description'),
            icon: '📝',
            topics: ['Common Words', 'Idioms', 'Phrasal Verbs', 'Synonyms'],
        },
        {
            title: t('pages.subjects.readingComprehension.title'),
            description: t('pages.subjects.readingComprehension.description'),
            icon: '🗣️',
            topics: ['Vowel Sounds', 'Consonants', 'Word Stress', 'Intonation'],
        },
    ];

    return (
        <ClientLayout>
            <div className="container mx-auto px-4 py-10">
                <PageTitle
                    title={t('pages.subjects.title')}
                    subtitle={t('pages.subjects.subtitle')}
                    color="teal"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {subjects.map((subject, index) => {
                        const totalTopics = subject.topics.length;
                        const completedTopics = mockCompletedTopics[index] || 0;
                        const progressPercent = Math.round((completedTopics / totalTopics) * 100);

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 m-3 transition-transform duration-200 hover:shadow-md hover:scale-[1.02] flex flex-col items-center text-center"
                            >
                                <div className="flex items-start justify-start gap-4 w-full mb-5">
                                    {/* Icon */}
                                    <div className="text-4xl">{subject.icon}</div>
                                    <div className="flex flex-col items-start text-start">
                                        {/* Title */}
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {subject.title}
                                        </h3>
                                        {/* Description */}
                                        <p className="text-sm text-gray-500">{subject.description}</p>
                                    </div>
                                </div>
                                {/* Progress Bar */}
                                <ProgressBar
                                    percent={progressPercent}
                                    completed={completedTopics}
                                    total={totalTopics}
                                    inwork={0}
                                    trackClassName="bg-gray-100 h-2 rounded-full"
                                    progressBarClassName="bg-teal-500 h-2 rounded-full"
                                    textColorClass="text-gray-600 text-sm mt-2"
                                />
                                <div className="w-full flex justify-end items-start mt-3 bg-">
                                    <button
                                        className="flex items-center gap-1 px-1 py-1 rounded-full bg-[rgb(var(--color-primary))] hover:bg-teal-600 text-white text-xs font-medium shadow transition-all duration-200"
                                        style={{ minWidth: 'unset', minHeight: 'unset' }}
                                        onClick={() => {
                                            window.location.href = `/frontend/questions/study?subject=${encodeURIComponent(subject.title)}`;
                                        }}
                                    >
                                        <span className="font-semibold tracking-wide px-2 text-lg">
                                            המשך
                                        </span>
                                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[rgb(var(--color-primary))] hover:bg-teal-600 transition-colors duration-200">
                                            <ArrowLeftIcon className="w-4 h-4 text-white" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ClientLayout>
    );
}

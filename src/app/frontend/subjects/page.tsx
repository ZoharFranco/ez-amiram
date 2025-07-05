'use client';

import ClientLayout from '@/frontend/components/ClientLayout';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useState } from 'react';
import ProgressBar from '../shared/progressBar'; // Assuming ProgressBar path is correct and it's the full component

// Mock Data and Types (for demonstration)
interface SubjectCategory {
    title: string;
    description: string;
    icon: string;
    topics: string[];
}

export default function SubjectsPage() {
    const { t } = useLanguage();
    
    // Mock state to simulate completed topics for progress bar demonstration
    const [mockCompletedTopics] = useState<Record<number, number>>({
        0: 2, // Subject 0 has 2 topics completed
        1: 0, // Subject 1 has 0 topics completed
        2: 3, // Subject 2 has 3 topics completed
    });

    const subjects: SubjectCategory[] = [
        {
            title: t('pages.subjects.restatement.title'),
            description: t('pages.subjects.restatement.description'),
            icon: '📖',
            topics: ['Tenses', 'Articles', 'Prepositions', 'Conditionals']
        },
        {
            title: t('pages.subjects.sentenceCompletion.title'),
            description: t('pages.subjects.sentenceCompletion.description'),
            icon: '📝',
            topics: ['Common Words', 'Idioms', 'Phrasal Verbs', 'Synonyms']
        },
        {
            title: t('pages.subjects.readingComprehension.title'),
            description: t('pages.subjects.readingComprehension.description'),
            icon: '🗣️',
            topics: ['Vowel Sounds', 'Consonants', 'Word Stress', 'Intonation']
        }
    ];

    return (
        <ClientLayout>
            <div className="container mx-auto px-4 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12 mb-22">
                    {subjects.map((subject, index) => {
                        // Removed isExpanded logic as cards are no longer expandable
                        const totalTopics = subject.topics.length;
                        const completedTopics = mockCompletedTopics[index] || 0;
                        const progressPercent = Math.round((completedTopics / totalTopics) * 100);

                        return (
                            <div
                                key={index}
                                className={`
                                    relative p-8 rounded-3xl shadow-xl transition-all duration-300
                                    bg-white/80 border border-gray-100 text-gray-800
                                    hover:shadow-2xl hover:border-[rgb(var(--color-primary-light))]
                                `}
                                // Removed onClick handler
                            >
                                {/* Title and Description */}
                                <h3 className="text-3xl font-extrabold mb-6 leading-tight text-gray-900 text-center">
                                    {subject.title}
                                    <span className="text-6xl text-[rgb(var(--color-primary))] transition-transform duration-300 ml-4 mr-4 mb-4">
                                        {subject.icon}
                                    </span>
                                </h3>
                                 {/* Progress Bar */}
                                 <div className="mb-4 mt-4 flex items-center justify-center"> {/* Centered with flex */}
                                    <ProgressBar
                                        percent={progressPercent}
                                        completed={completedTopics}
                                        total={totalTopics}
                                        inwork={0}
                                        // Simplified styles for static display
                                        trackClassName="bg-gray-200"
                                        progressBarClassName="bg-[rgb(var(--color-primary))]"
                                        textColorClass="text-gray-700"
                                    />
                                </div>
                                <p className="text-lg leading-relaxed mb-6 text-gray-600 text-center">
                                    {subject.description}
                                </p>

                                

                                {/* Removed Expanded Content (Topics) and Expand/Collapse Hint */}
                            </div>
                        );
                    })}
                </div>
            </div>
        </ClientLayout>
    );
}
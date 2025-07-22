'use client';



import ClientLayout from '@/frontend/components/ClientLayout';
import CurrentGradeCard from '@/frontend/components/CurrentGradeCard';
import BasicsSection from '@/frontend/components/ui/pages/home/BasicsSection';

import PageTitle from '@/frontend/components/PageTitle';
import TestUnitsSection from '@/frontend/components/TestUnitsSection';

import TimeSelectionDialog from '@/frontend/components/TimeSelectionDialog';
import AuthButton from '@/frontend/components/common/signOutButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [animateProgress, setAnimateProgress] = useState(false);

  // Data for subcomponents
  const predictedGrade = 115;
  const learningStreak = 7;
  const topics = [
    {
      key: 'restatement',
      progress: 75,
      title: t('pages.home.topics.restatement'),
      description: t('pages.home.topics.restatementDescription'),
      questionsAnswered: 15,
      totalQuestions: 20,
    },
    {
      key: 'sentenceCompletion',
      progress: 85,
      title: t('pages.home.topics.sentenceCompletion'),
      description: t('pages.home.topics.sentenceCompletionDescription'),
      questionsAnswered: 17,
      totalQuestions: 20,
    },
    {
      key: 'readingComprehension',
      progress: 70,
      title: t('pages.home.topics.readingComprehension'),
      description: t('pages.home.topics.readingComprehensionDescription'),
      questionsAnswered: 14,
      totalQuestions: 20,
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeSelection = (minutes: number) => {
    router.push(`/frontend/questions/start?duration=${minutes}`);
  };


  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-10">
        <PageTitle title={t('pages.home.title')} subtitle={t('pages.home.subtitle')} />
          <div className="flex flex-col lg:flex-row items-stretch gap-8">
            {/* Left: Grade Card + AuthButton */}
            <div className="lg:w-1/3 w-full flex flex-col justify-center items-center">
              <CurrentGradeCard
                predictedGrade={predictedGrade}
                learningStreak={learningStreak}
                animateProgress={animateProgress}
              />
            </div>

            {/* Divider for desktop */}
            <div className="hidden lg:block w-px bg-gray-200 mx-4" />

            {/* Right: Main Content */}
            <div className="lg:w-2/3 w-full flex flex-col gap-8 justify-center">
              <TestUnitsSection topics={topics} />
              <BasicsSection />
            </div>
          </div>
        </div>

        <TimeSelectionDialog
          isOpen={isTimeDialogOpen}
          onClose={() => setIsTimeDialogOpen(false)}
          onSelectTime={handleTimeSelection}
        />
        {/* Fix: Add missing closing for <AuthButton /> */}
        <AuthButton />
    </ClientLayout>
  );
}

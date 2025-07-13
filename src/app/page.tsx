'use client';


import ActionButtons from '@/frontend/components/ActionButtons';
import ClientLayout from '@/frontend/components/ClientLayout';
import CurrentGradeCard from '@/frontend/components/CurrentGradeCard';
import BasicsSection from '@/frontend/components/ui/pages/home/BasicsSection';

import PageTitle from '@/frontend/components/PageTitle';
import TestUnitsSection from '@/frontend/components/TestUnitsSection';

import TimeSelectionDialog from '@/frontend/components/TimeSelectionDialog';
import AuthButton from '@/frontend/components/common/signOutButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useAuth } from '@/frontend/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const isRTL = dir === 'rtl';
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
    },
    {
      key: 'sentenceCompletion',
      progress: 85,
      title: t('pages.home.topics.sentenceCompletion'),
      description: t('pages.home.topics.sentenceCompletionDescription'),
    },
    {
      key: 'readingComprehension',
      progress: 70,
      title: t('pages.home.topics.readingComprehension'),
      description: t('pages.home.topics.readingComprehensionDescription'),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimateProgress(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeSelection = (minutes: number) => {
    router.push(`/frontend/questions/start?duration=${minutes}`);
  };

  const handleSimulationClick = () => {
    router.push('/frontend/simulations/start');
  };

  return (
    <ClientLayout>

      <div className="container mx-auto px-4 py-10">
        <PageTitle title={t('pages.home.title')} subtitle={t('pages.home.subtitle')} />

        <div className="px-8 mb-10 max-w-6xl mx-auto">
          {user && (
            <><CurrentGradeCard
              predictedGrade={predictedGrade}
              learningStreak={learningStreak}
              animateProgress={animateProgress}
            />
              <ActionButtons
                onQuickLearn={() => setIsTimeDialogOpen(true)}
                onSimulation={handleSimulationClick}
                t={t}
              />
            </>

          )}


          {user && (
            <>
              <TestUnitsSection topics={topics} />
              <BasicsSection />
            </>
          )}
          <AuthButton />
          <TimeSelectionDialog
            isOpen={isTimeDialogOpen}
            onClose={() => setIsTimeDialogOpen(false)}
            onSelectTime={handleTimeSelection}
          />
        </div>
      </div>

    </ClientLayout>
  );
}

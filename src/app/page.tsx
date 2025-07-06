'use client';

import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import TimeSelectionDialog from '@/frontend/components/TimeSelectionDialog';
import AuthButton from '@/frontend/components/common/signOutButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useAuth } from '@/frontend/contexts/auth-context';
import { ChartBarIcon, FireIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { TestTube2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const isRTL = dir === 'rtl';
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);

  const [animateProgress, setAnimateProgress] = useState(false);

  const predictedGrade = 85;
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

  // Calculate circle properties
  const size = 320; // Size of the SVG
  const strokeWidth = 12; // Width of the progress bar
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (predictedGrade / 100) * circumference;

  useEffect(() => {
    // Trigger animation after component mount
    const timer = setTimeout(() => setAnimateProgress(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleTimeSelection = (minutes: number) => {
    router.push(`/frontend/questions/start?duration=${minutes}`);
  };

  const handleSimulationClick = () => {
    router.push('/frontend/simulation/start');
  };

  return (

    <ClientLayout>
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[rgb(var(--color-background))] mb-28">
        <div className="px-8 mb-10 max-w-6xl mx-auto">
          <PageTitle title={t('pages.home.title')} subtitle={t('pages.home.subtitle')} />
        {/* Current Grade Card */}
        {user && (
          <div className="card p-12 gradient-animate">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-title text-white">
                  {t('pages.home.currentGrade')}
                </h2>
                <div className="badge badge-accent">
                  <span>{learningStreak} {t('pages.home.learningStreak')}</span>
                  <FireIcon className="w-5 h-5 inline-block mr-2" />
                </div>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="circular-progress mb-8">
                  <div className="relative">
                    <svg width={size} height={size}>
                      {/* Background circle */}
                      <circle
                        className="progress-background"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                      />
                      {/* Progress circle */}
                      <circle
                        className="progress-circle"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        style={{
                          strokeDasharray: circumference,
                          strokeDashoffset: animateProgress ? progressOffset : circumference,
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-7xl font-bold text-white block">
                          {predictedGrade}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-subtitle text-white/90 text-center">
                  {t('pages.home.outOf')} 100
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
          <div className="grid-auto-fit gap-8 mt-6 mb-8">
          <button
            onClick={() => setIsTimeDialogOpen(true)}
              className="card card-hover p-10 group bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-secondary))] text-white items-center justify-center text-start"
            >
              <p className="text-subtitle text-white/90 group-hover:text-white transition-colors text-start flex items-center gap-2 justify-between">
                {t('pages.home.quickLearnDescription')}
                <RocketLaunchIcon className="w-10 h-10" />
              </p>
          </button>

          <button
            onClick={handleSimulationClick}
              className="card card-hover p-10 group bg-gradient-to-br from-[rgb(var(--color-secondary))] to-[rgb(var(--color-accent))] text-white items-center justify-center text-start"
          >
              <p className="text-subtitle text-white/90 group-hover:text-white transition-colors text-start flex items-center gap-2 justify-between">
                {t('pages.home.fullSimulationDescription')}
                <TestTube2 className="w-10 h-10" />
              </p>
          </button>
        </div>

        {/* Topics Progress */}
        {user && (
          <div className="card p-10">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-title">
                {t('pages.home.recentProgress')}
              </h2>
              <div className="badge badge-secondary">
                <ChartBarIcon className="w-6 h-6" />
              </div>
            </div>
            <div className="space-y-8">
              {topics.map((topic, index) => (
                <div key={topic.key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-subtitle text-[rgb(var(--color-text))]">
                      {t(`pages.home.topics.${topic.key}`)}
                    </span>
                    <span className="badge badge-primary text-lg">
                      {topic.progress}%
                    </span>
                  </div>
                  <div className="progress-bar h-3">
                    <div
                      className={`progress-bar-fill ${isRTL ? 'rotate-180' : ''}`}
                      style={{
                        width: `${topic.progress}%`,
                        backgroundImage: `linear-gradient(to right, rgb(var(--color-primary)), rgb(var(--color-${index % 2 ? 'secondary' : 'accent'})))`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

        <AuthButton />
      <TimeSelectionDialog
        isOpen={isTimeDialogOpen}
        onClose={() => setIsTimeDialogOpen(false)}
        onSelectTime={handleTimeSelection}
        />
    </div>
    </ClientLayout>
  );
}

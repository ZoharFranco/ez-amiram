'use client';

import ClientLayout from '@/frontend/components/ClientLayout';

import PageTitle from '@/frontend/components/PageTitle';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import ExpandCategory from './expandCategory';
import { Category } from './types';

export default function TipsPage() {
  const { t } = useLanguage();
  const [tipStates, setTipStates] = useState<Record<string, 'unread' | 'inwork' | 'read'>>({});
  const [expandedCategory, setExpandedCategory] = useState<number | null>(0); // first category open by default

  const categories: Category[] = [
    {
      icon: '🔥',
      title: t('pages.tips.categories.dailyPractice'),
      description: t('pages.tips.categories.dailyPracticeDesc'),
      tips: [
        {
          id: 'dailyPractice',
          title: t('pages.tips.dailyPractice.title'),
          description: t('pages.tips.dailyPractice.description'),
          icon: '📚',
        },
      ],
    },
    {
      icon: '🎧',
      title: t('pages.tips.categories.listening'),
      description: t('pages.tips.categories.listeningDesc'),
      tips: [
        {
          id: 'hear',
          title: t('pages.tips.hear.title'),
          description: t('pages.tips.hear.description'),
          icon: '🎧',
        },
      ],
    },
    {
      icon: '🗣️',
      title: t('pages.tips.categories.speaking'),
      description: t('pages.tips.categories.speakingDesc'),
      tips: [
        {
          id: 'tryToSpeak',
          title: t('pages.tips.tryToSpeak.title'),
          description: t('pages.tips.tryToSpeak.description'),
          icon: '🗣️',
        },
      ],
    },
  ];

  const allTips = categories.flatMap((cat) => cat.tips);

  useEffect(() => {
    const initialStates: Record<string, 'unread' | 'inwork' | 'read'> = {};
    allTips.forEach((tip) => {
      if (!(tip.id in tipStates)) {
        initialStates[tip.id] = 'unread';
      }
    });
    if (Object.keys(initialStates).length > 0) {
      setTipStates((prev) => ({ ...initialStates, ...prev }));
    }
  }, [allTips]);

  const handleTipClick = (tipId: string) => {
    setTipStates((prev) => {
      const current = prev[tipId] || 'unread';
      const next =
        current === 'unread' ? 'inwork' : current === 'inwork' ? 'read' : 'unread';
      return { ...prev, [tipId]: next };
    });
  };

  const readCount = Object.values(tipStates).filter((s) => s === 'read').length;
  const score = Math.round((readCount / allTips.length) * 100);
  const isAllRead = readCount === allTips.length;

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <PageTitle title={t('pages.tips.title')} subtitle={t('pages.tips.subtitle')} />

        <div className="flex flex-col gap-10 mt-8">
          {categories.map((category, idx) => (
            <ExpandCategory
              key={idx}
              category={category}
              isExpanded={expandedCategory === idx}
              toggle={() => setExpandedCategory((prev) => (prev === idx ? null : idx))}
              tipStates={tipStates}
              onTipClick={handleTipClick}
              t={t}
            />
          ))}
        </div>

        <div className="mt-12 card p-8 bg-gradient-to-br from-[rgb(var(--color-primary))] to-[rgb(var(--color-primary-dark))] text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{t('pages.tips.your_progress')}</h2>
              <p className="text-white/90">
                {isAllRead ? t('pages.tips.all_completed') : t('pages.tips.progress_message')}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border-4 border-white/20">
                <span className="text-3xl font-bold">{score}%</span>
              </div>
              {isAllRead && <div className="animate-bounce text-4xl">🎉</div>}
            </div>
          </div>
          <div className="mt-6 w-full bg-white/10 rounded-full h-2">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}

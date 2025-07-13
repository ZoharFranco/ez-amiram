'use client';

import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import { Category } from '@/frontend/components/ui/pages/tips/types';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useEffect, useState } from 'react';

export default function TipsPage() {
  const { t } = useLanguage();
  const [tipStates, setTipStates] = useState<Record<string, 'unread' | 'inwork' | 'read'>>({});

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
  }, [allTips, tipStates]);

  const toggleTipState = (tipId: string) => {
    setTipStates((prev) => {
      const current = prev[tipId] || 'unread';
      const next = current === 'unread' ? 'inwork' : current === 'inwork' ? 'read' : 'unread';
      return { ...prev, [tipId]: next };
    });
  };

  const readCount = Object.values(tipStates).filter((s) => s === 'read').length;
  const progress = Math.round((readCount / allTips.length) * 100);

  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-10">
        <PageTitle title={t('pages.tips.title')} subtitle={t('pages.tips.subtitle')} color="orange" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {categories.map((category, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200 shadow-sm hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
              <ul className="space-y-3 mt-4">
                {category.tips.map((tip) => (
                  <li
                    key={tip.id}
                    onClick={() => toggleTipState(tip.id)}
                    className="p-4 bg-white rounded-xl border hover:bg-orange-50 transition cursor-pointer flex items-center gap-3"
                  >
                    <span className="text-xl">{tip.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{tip.title}</h4>
                      <p className="text-sm text-gray-500">{tip.description}</p>
                    </div>
                    <div className={`text-xs px-3 py-1 rounded-full font-bold capitalize shadow-sm ${tipStates[tip.id] === 'read'
                      ? 'bg-green-100 text-green-700 border border-green-400'
                      : tipStates[tip.id] === 'inwork'
                        ? 'bg-yellow-100 text-yellow-700 border border-yellow-400'
                        : 'bg-gray-100 text-gray-500 border border-gray-300'
                      }`}>
                      {tipStates[tip.id] || 'unread'}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">{t('pages.tips.your_progress')}</h2>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">{progress}% {t('pages.tips.completed')}</div>
        </div>
      </div>
    </ClientLayout>
  );
}

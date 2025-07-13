'use client';

import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useState } from 'react';

type SubItem = {
  text: string;
  category: string;
  level: string;
  completed: boolean;
};

const allSubItems: SubItem[] = [
  { text: 'אבל', category: 'קישור', level: 'Level A', completed: true },
  { text: 'וגם', category: 'קישור', level: 'Level A', completed: false },
  { text: 'כי', category: 'קישור', level: 'Level A', completed: true },
  { text: 'שם1', category: 'שם', level: 'Level A', completed: true },
  { text: 'שם2', category: 'שם', level: 'Level A', completed: true },
  { text: 'תואר1', category: 'תואר', level: 'Level B', completed: false },
  { text: 'פועל1', category: 'פועל', level: 'Level B', completed: true },
  { text: 'צורה1', category: 'צורה', level: 'Level C', completed: false },
  { text: 'תחילית א', category: 'תחילית', level: 'Level C', completed: true },
];

type ViewBy = 'category' | 'level';

export default function VocabularyPage() {
  const { t } = useLanguage();
  const [viewBy, setViewBy] = useState<ViewBy>('category');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Group sub-items by category or level
  const groupedSubItems = allSubItems.reduce<Record<string, SubItem[]>>((groups, item) => {
    const key = viewBy === 'category' ? item.category : item.level;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  // Calculate progress for a group (completed / total)
  function getProgress(items: SubItem[]) {
    const total = items.length;
    const completed = items.filter((i) => i.completed).length;
    return total > 0 ? (completed / total) * 100 : 0;
  }

  if (selectedGroup) {
    // Detail view for selected group
    const items = groupedSubItems[selectedGroup] ?? [];

    return (
      <ClientLayout>
        <div className="min-h-screen  px-4 py-6 max-w-md mx-auto">
          <button
            onClick={() => setSelectedGroup(null)}
            className="text-blue-600 hover:underline"
          >
            חזרה
          </button>
          <h1 className="text-4xl mb-10 font-bold text-center mb-4">{selectedGroup}</h1>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border flex justify-between items-center ${item.completed ? 'bg-green-100 border-green-400' : 'bg-white border-gray-300'
                  }`}
              >
                <span className="font-medium text-gray-800">{item.text}</span>
                <span className="text-sm font-semibold text-gray-700">
                  {item.completed ? '✓' : '✗'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ClientLayout>
    );
  }

  // Main grouping view
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-10">
        <PageTitle title={t('pages.vocabulary.title')} subtitle={t('pages.vocabulary.subtitle')} color='indigo' />
        <div className="mb-30">
          <div className="flex justify-center gap-4 m-4">
            <SelectionButton
            onClick={() => {
              setViewBy('category');
              setSelectedGroup(null);
            }}
              text={t("pages.vocabulary.selection.category")}
              selected={viewBy === 'category'}
            />

            <SelectionButton
            onClick={() => {
              setViewBy('level');
              setSelectedGroup(null);
            }}
              text={t("pages.vocabulary.selection.level")}
              selected={viewBy === 'level'}
            />
        </div>

          <div className="space-y-4 m-6">
          {Object.entries(groupedSubItems).map(([groupName, items]) => {
            const progress = getProgress(items);
            return (
              <div
                key={groupName}
                className="cursor-pointer p-4 rounded-lg border hover:bg-blue-50 transition"
                onClick={() => setSelectedGroup(groupName)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold">{groupName}</h2>
                  <span className="text-sm text-gray-600">
                    {items.filter((i) => i.completed).length} / {items.length}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </ClientLayout>
  );
}

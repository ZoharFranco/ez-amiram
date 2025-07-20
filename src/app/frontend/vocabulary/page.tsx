'use client';

import { VocabularyWord, vocabularyWords, WordStatus } from '@/config/content/vocabulary/vocabulary';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useState } from 'react';
import { LevelView } from '@/frontend/components/ui/vocabulary';

// --- Main Page ---
type ViewBy = 'category' | 'level';

type GroupListProps = {
  groupedVocabularyWord: Record<string, VocabularyWord[]>;
  onSelectGroup: (group: string) => void;
  getProgress: (items: VocabularyWord[]) => number;
  viewBy: ViewBy;
  t: (key: string) => string;
};

function GroupList({ groupedVocabularyWord, onSelectGroup, getProgress, viewBy, t }: GroupListProps) {
  return (
    <div className="space-y-4 m-6">
      {Object.entries(groupedVocabularyWord).map(([groupName, items]) => {
        const progress = getProgress(items);
        const groupLabel =
          viewBy === 'category'
            ? t('pages.vocabulary.category') || 'Category'
            : t('pages.vocabulary.level') || 'Level';
        return (
          <div
            key={groupName}
            className="cursor-pointer p-3 rounded-xl border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300 hover:shadow-lg"
            onClick={() => onSelectGroup(groupName)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-lg font-medium">{groupLabel}:</span>
                  <h2 className="text-2xl font-bold text-emerald-700">{groupName}</h2>
                </div>
                <div className="flex-1 flex justify-center">
                </div>
                <div className="text-right">
                  <div className="flex flex-row md:flex-row md:items-center gap-1 md:gap-2">
                    <div className="text-lg font-bold text-emerald-600 md:text-2xl">{Math.ceil(progress)}%</div>

                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-xs text-gray-600 md:text-lg text-center mt-2">
              {items.length} {t('pages.vocabulary.words') || 'words'}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function VocabularyPage() {
  const { t } = useLanguage();
  const [viewBy, setViewBy] = useState<ViewBy>('level');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [words, setWords] = useState<VocabularyWord[]>(vocabularyWords);
  const [quizOpen, setQuizOpen] = useState(false);

  // Group sub-items by category or level
  const groupedVocabularyWords: Record<string, VocabularyWord[]> = words.reduce((groups, item) => {
    const key = viewBy === 'category' ? item.category : item.level.toString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, VocabularyWord[]>);

  // Calculate progress for a group (learned / total)
  function getProgress(items: VocabularyWord[]) {
    const total = items.length;
    const learned = items.filter((i) => i.status === 'learned').length;
    return total > 0 ? (learned / total) * 100 : 0;
  }

  // Handler for changing word status
  function handleStatusChange(word: VocabularyWord, status: WordStatus) {
    setWords((prev) =>
      prev.map((w) =>
        w.word === word.word && w.category === word.category && w.level === word.level
          ? { ...w, status }
          : w
      )
    );
  }

  // Detail view for selected group
  if (selectedGroup) {
    const items = groupedVocabularyWords[selectedGroup] ?? [];
    const level = viewBy === 'level' ? parseInt(selectedGroup) : 1;

    return (
      <LevelView
        level={level}
        words={items}
        onBack={() => setSelectedGroup(null)}
        onStatusChange={handleStatusChange}
        onStartQuiz={() => setQuizOpen(true)}
        quizOpen={quizOpen}
        onCloseQuiz={() => setQuizOpen(false)}
      />
    );
  }

  // Main grouping view
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-10">
        <PageTitle
          title={t('pages.vocabulary.title')}
          subtitle={t('pages.vocabulary.subtitle')}
          color="blue"
        />
        <div className="mb-30">
          <div className="flex justify-center gap-4 m-4">
            <SelectionButton
              onClick={() => {
                setViewBy('category');
                setSelectedGroup(null);
              }}
              text={t('pages.vocabulary.selection.category')}
              selected={viewBy === 'category'}
            />
            <SelectionButton
              onClick={() => {
                setViewBy('level');
                setSelectedGroup(null);
              }}
              text={t('pages.vocabulary.selection.level')}
              selected={viewBy === 'level'}
            />
          </div>
          <GroupList
            groupedVocabularyWord={groupedVocabularyWords}
            onSelectGroup={setSelectedGroup}
            getProgress={getProgress}
            viewBy={viewBy}
            t={t}
          />
        </div>
      </div>
    </ClientLayout>
  );
}

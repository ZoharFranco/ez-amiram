'use client';

import { VocabularyWord, WordStatus } from '@/lib/types/vocabulary';
import ClientLayout from '@/frontend/components/ClientLayout';
import PageTitle from '@/frontend/components/PageTitle';
import SelectionButton from '@/frontend/components/shared/selectionButton';
import { useLanguage } from '@/frontend/contexts/LanguageContext';
import { useAuth } from '@/frontend/hooks/use-auth';
import { useVocabularyStore } from '@/frontend/stores/vocabulary-store';
import VocabularyHandler from '@/frontend/handlers/firebase/vocabulary';
import { db } from '@/backend/services/external/firebase/firebase';
import { useState, useEffect } from 'react';
import { LevelView } from '@/frontend/components/ui/vocabulary';
import Spinner from '@/frontend/components/shared/spinner';

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
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 w-full">
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
            <div className="text-lg text-gray-600 md:text-2xl text-center mt-1 mb-4">
              {items.length} {t('pages.vocabulary.words') || 'words'}
            </div>
            {/* Progress bar as a border at the bottom of the card */}
            <div className="relative -mx-3 -mb-3">
              <div className="absolute left-0 bottom-0 w-full h-2 rounded-b-xl overflow-hidden">
                {/* Progress bar background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-b-xl" style={{ zIndex: 0 }} />
                {/* Progress bar foreground */}
                <div
                  className="relative h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500 rounded-b-xl"
                  style={{ width: `${progress}%`, zIndex: 1 }}
                />
                <div
                  className="absolute top-0 left-0 w-full h-2 border-b-2 border-gray-200 rounded-b-xl pointer-events-none"
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function VocabularyPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [viewBy, setViewBy] = useState<ViewBy>('level');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  
  // Use vocabulary store
  const {
    words,
    loading,
    categoryProgress,
    levelProgress,
    loadUserProgress,
    saveUserProgress,
    updateWordStatus
  } = useVocabularyStore();

  // Load user progress on component mount
  useEffect(() => {
    if (user?.uid) {
      // Load user-specific progress and update store
      loadUserProgress(db, user.uid);
    }
    // Words are now initialized immediately in the store, no need to call initializeWords
  }, [user?.uid, loadUserProgress]);

  // Group sub-items by category or level
  const groupedVocabularyWords: Record<string, VocabularyWord[]> = words.reduce((groups, item) => {
    const key = viewBy === 'category' ? item.category : item.level.toString();
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, VocabularyWord[]>);

  // Get cached progress for a group
  function getProgress(groupName: string, viewBy: ViewBy): number {
    if (viewBy === 'category') {
      return categoryProgress[groupName]?.percentage || 0;
    } else {
      return levelProgress[groupName]?.percentage || 0;
    }
  }

  // Handler for changing word status
  async function handleStatusChange(word: VocabularyWord, status: WordStatus) {
    // Update local state immediately (this will recalculate cached progress)
    updateWordStatus(word.id, status);
    
    // Save to Firebase if user is authenticated
    if (user?.uid) {
      try {
        const vocabularyHandler = new VocabularyHandler(db);
        await vocabularyHandler.updateWordStatus(user.uid, word.id, status);
        await saveUserProgress(db, user.uid);
      } catch (error) {
        console.error('Error saving word status:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        alert(`Failed to save progress: ${errorMessage}. Your changes are saved locally but may not sync.`);
      }
    }
  }

  // Show loading state
  if (loading) {
    return (
      <ClientLayout>
        <Spinner
        />
      </ClientLayout>
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
            getProgress={(items) => {
              // Get the group name from the first item
              const groupName = viewBy === 'category' ? items[0]?.category : items[0]?.level.toString();
              return groupName ? getProgress(groupName, viewBy) : 0;
            }}
            viewBy={viewBy}
            t={t}
          />
        </div>
      </div>
    </ClientLayout>
  );
}

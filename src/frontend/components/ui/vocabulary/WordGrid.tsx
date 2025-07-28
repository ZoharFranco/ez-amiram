import { VocabularyWord, WordStatus } from '@/lib/types/vocabulary';
import ModernWordCard from './ModernWordCard';
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useVocabularyStore } from '@/frontend/stores/vocabulary-store';
import { useAuth } from '@/frontend/hooks/use-auth';
import { db } from '@/backend/services/external/firebase/firebase';
import VocabularyHandler from '@/frontend/handlers/firebase/vocabulary';

type WordGridProps = {
  words: VocabularyWord[];
  onWordClick: (word: VocabularyWord) => void;
};

const WORDS_PER_PAGE = 50; // Show 18 words initially (6-9 rows depending on screen size)

// Helper to sort words by status: learned > learning > toLearn
function sortWordsByStatus(words: VocabularyWord[]): VocabularyWord[] {
  const statusOrder = ['learned', 'learning', 'toLearn'];
  return [...words].sort((a, b) => {
    const aStatus = a.status || 'toLearn';
    const bStatus = b.status || 'toLearn';
    const aIdx = statusOrder.indexOf(aStatus);
    const bIdx = statusOrder.indexOf(bStatus);
    return aIdx - bIdx;
  });
}

export default function WordGrid({ words, onWordClick }: WordGridProps) {
  const { user } = useAuth();
  const { updateWordStatus, saveUserProgress } = useVocabularyStore();
  const vocabularyHandler = useMemo(() => new VocabularyHandler(db), []);
  
  // Sort words only once at the beginning, never re-sort
  const [displayWords, setDisplayWords] = useState<VocabularyWord[]>(() => sortWordsByStatus(words));
  const [visibleCount, setVisibleCount] = useState(Math.min(WORDS_PER_PAGE, words.length));
  const [isLoading, setIsLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Update words without sorting - just sync the status from the store
  useEffect(() => {
    setDisplayWords(prevWords => 
      prevWords.map(prevWord => {
        const updatedWord = words.find(w => w.id === prevWord.id);
        return updatedWord || prevWord;
      })
    );
    setVisibleCount(Math.min(WORDS_PER_PAGE, words.length));
  }, [words]);

  // Load more words when scrolling near bottom
  const loadMoreWords = useCallback(() => {
    if (isLoading || visibleCount >= displayWords.length) return;
    
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + WORDS_PER_PAGE, displayWords.length));
      setIsLoading(false);
    }, 300); // Small delay for smooth experience
  }, [isLoading, visibleCount, displayWords.length]);

  // Intersection observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < displayWords.length) {
          loadMoreWords();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = document.getElementById('scroll-sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMoreWords, visibleCount, displayWords.length]);

  if (words.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="text-center animate-fade-in">
          <div className="text-6xl mb-4 opacity-50">📚</div>
          <p className="text-gray-500 text-lg">No words in this level yet.</p>
          <p className="text-gray-400 text-sm mt-2">Words will appear here as you progress</p>
        </div>
      </div>
    );
  }

  function cycleStatus(current: WordStatus | undefined): WordStatus {
    const order: WordStatus[] = ['toLearn', 'learning', 'learned'];
    const idx = order.indexOf(current || 'toLearn');
    return order[(idx + 1) % order.length];
  }

  async function handleStatusIconClick(word: VocabularyWord) {
    if (!user) {
      console.log('User not authenticated');
      return; // Don't save if user is not authenticated
    }
    
    const newStatus = cycleStatus(word.status);
    
    try {
      // Update the store state immediately for optimistic UI
      updateWordStatus(word.id, newStatus);
      
      // Save to Firebase asynchronously
      await vocabularyHandler.updateWordStatus(user.uid, word.id, newStatus);
      
      // Optionally save the entire progress to keep everything in sync
      // (this ensures the store and Firebase are fully synchronized)
      await saveUserProgress(db, user.uid);
      
    } catch (error) {
      console.error('Error saving word status:', error);
      // You might want to revert the optimistic update here if needed
      // or show an error message to the user
    }
  }

  const visibleWords = displayWords.slice(0, visibleCount);

  return (
    <div className="relative">
      {/* Enhanced grid with staggered animations - original grid size */}
      <div 
        ref={gridRef}
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 p-1 grid-stagger"
      >
        {visibleWords.map((word) => (
          <div
            key={`${word.word}-${word.category}-${word.level}`}
            className="group"
          >
            <div className="transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg">
              <ModernWordCard
                word={word}
                onClick={() => onWordClick(word)}
                onStatusIconClick={() => handleStatusIconClick(word)}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Scroll sentinel for infinite loading */}
      {visibleCount < displayWords.length && (
        <div id="scroll-sentinel" className="h-20 flex items-center justify-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-emerald-600">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading more words...</span>
            </div>
          ) : (
            <button
              onClick={loadMoreWords}
              className="px-6 py-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Load more words ({displayWords.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
      
      {/* Progress indicator */}
      {displayWords.length > WORDS_PER_PAGE && (
        <div className="text-center py-4">
          <div className="text-sm text-gray-500">
            Showing {visibleCount} of {displayWords.length} words
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2 max-w-xs mx-auto">
            <div 
              className="bg-emerald-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(visibleCount / displayWords.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
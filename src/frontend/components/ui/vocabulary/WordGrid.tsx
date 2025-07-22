import { VocabularyWord, WordStatus } from '@/config/content/vocabulary/vocabulary';
import ModernWordCard from './ModernWordCard';
import React, { useState, useEffect } from 'react';

type WordGridProps = {
  words: VocabularyWord[];
  onWordClick: (word: VocabularyWord) => void;
};

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
  const [localWords, setLocalWords] = useState<VocabularyWord[]>(() => sortWordsByStatus(words));
  useEffect(() => {
    setLocalWords(sortWordsByStatus(words));
  }, [words]);

  if (words.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">📚</div>
        <p className="text-gray-500">No words in this level yet.</p>
      </div>
    );
  }

  function cycleStatus(current: WordStatus | undefined): WordStatus {
    const order: WordStatus[] = ['toLearn', 'learning', 'learned'];
    const idx = order.indexOf(current || 'toLearn');
    return order[(idx + 1) % order.length];
  }

  function handleStatusIconClick(word: VocabularyWord) {
    setLocalWords(prevWords => prevWords.map(w =>
      w.word === word.word && w.level === word.level && w.category === word.category
        ? { ...w, status: cycleStatus(w.status) }
        : w
    ));
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {localWords.map((word, index) => (
        <div
          key={`${word.word}-${word.category}-${word.level}`}
          className="animate-slide-in word-card-stagger"
          style={{ 
            '--stagger-index': index,
            animationDelay: `${index * 50}ms` 
          } as React.CSSProperties}
        >
          <ModernWordCard
            word={word}
            onClick={() => onWordClick(word)}
            onStatusIconClick={() => handleStatusIconClick(word)}
          />
        </div>
      ))}
    </div>
  );
} 
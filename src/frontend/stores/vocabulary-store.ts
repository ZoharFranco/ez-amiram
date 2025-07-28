import { create } from 'zustand';
import { VocabularyWord, WordStatus, VocabularyProgress } from '@/lib/types/vocabulary';
import { vocabularyWords as defaultVocabularyWords } from '@/config/content/vocabulary/vocabulary';
import { Firestore, doc, setDoc, getDoc } from 'firebase/firestore';

interface VocabularyStore {
  words: VocabularyWord[];
  loading: boolean;
  progress: VocabularyProgress | null;
  
  // Cached progress calculations
  categoryProgress: Record<string, { total: number; learned: number; percentage: number }>;
  levelProgress: Record<string, { total: number; learned: number; percentage: number }>;
  
  // Actions
  setWords: (words: VocabularyWord[]) => void;
  updateWordStatus: (wordId: string, status: WordStatus) => void;
  loadUserProgress: (db: Firestore, userId: string) => Promise<void>;
  saveUserProgress: (db: Firestore, userId: string) => Promise<void>;
  initializeWords: (userId?: string) => void;
  resetProgress: () => void;
  calculateProgress: () => void;
}

export const useVocabularyStore = create<VocabularyStore>((set, get) => {
  // Initialize with default words immediately
  const initialWords = defaultVocabularyWords.map(word => {
    const wordId = `${word.word}_${word.category}_${word.level}`;
    return {
      id: wordId,
      word: word.word,
      definition: word.definition,
      example: word.example,
      hebrewTranslation: word.hebrewTranslation,
      category: word.category,
      level: word.level,
      status: 'toLearn' as WordStatus, // All words start as toLearn by default
      createdAt: new Date(),
      updatedAt: new Date(),
    } as VocabularyWord;
  });

  // Initial progress calculation with only non-toLearn words
  const initialProgress: VocabularyProgress = {
    userId: '',
    wordsProgress: initialWords.reduce((acc, word) => {
      // Only store words that are NOT toLearn (i.e., learned or learning)
      if (word.status && word.status !== 'toLearn') {
        acc[word.id] = word.status;
      }
      return acc;
    }, {} as Record<string, WordStatus>)
  };

  // Calculate progress helper function
  const calculateProgressData = (words: VocabularyWord[]) => {
    const categoryProgress: Record<string, { total: number; learned: number; percentage: number }> = {};
    const levelProgress: Record<string, { total: number; learned: number; percentage: number }> = {};
    
    // Group words by category and level
    const categories: Record<string, VocabularyWord[]> = {};
    const levels: Record<string, VocabularyWord[]> = {};
    
    words.forEach(word => {
      // Group by category
      if (!categories[word.category]) categories[word.category] = [];
      categories[word.category].push(word);
      
      // Group by level
      const levelKey = word.level.toString();
      if (!levels[levelKey]) levels[levelKey] = [];
      levels[levelKey].push(word);
    });
    
    // Calculate category progress
    Object.entries(categories).forEach(([category, categoryWords]) => {
      const total = categoryWords.length;
      const learned = categoryWords.filter(w => w.status === 'learned').length;
      const percentage = total > 0 ? (learned / total) * 100 : 0;
      
      categoryProgress[category] = { total, learned, percentage };
    });
    
    // Calculate level progress
    Object.entries(levels).forEach(([level, levelWords]) => {
      const total = levelWords.length;
      const learned = levelWords.filter(w => w.status === 'learned').length;
      const percentage = total > 0 ? (learned / total) * 100 : 0;
      
      levelProgress[level] = { total, learned, percentage };
    });
    
    return { categoryProgress, levelProgress };
  };

  // Initial progress calculation
  const { categoryProgress: initialCategoryProgress, levelProgress: initialLevelProgress } = calculateProgressData(initialWords);

  return {
    words: initialWords,
    loading: false,
    progress: initialProgress,
    categoryProgress: initialCategoryProgress,
    levelProgress: initialLevelProgress,

    setWords: (words) => {
      const { categoryProgress, levelProgress } = calculateProgressData(words);
      set({ words, categoryProgress, levelProgress });
    },

    updateWordStatus: (wordId, status) => {
      const { words, progress } = get();
      
      // Update the words array
      const updatedWords = words.map(word => 
        word.id === wordId ? { ...word, status } : word
      );
      
      // Update the progress object - only store non-toLearn words
      const updatedProgress = progress ? {
        ...progress,
        wordsProgress: {
          ...progress.wordsProgress
        }
      } : null;
      
      if (updatedProgress) {
        if (status === 'toLearn') {
          // Remove the word from progress if it's set back to toLearn
          delete updatedProgress.wordsProgress[wordId];
        } else {
          // Only save if it's learned or learning
          updatedProgress.wordsProgress[wordId] = status;
        }
      }
      
      // Recalculate cached progress
      const { categoryProgress, levelProgress } = calculateProgressData(updatedWords);
      
      set({ 
        words: updatedWords, 
        progress: updatedProgress,
        categoryProgress,
        levelProgress
      });
    },

    loadUserProgress: async (db, userId) => {
      set({ loading: true });
      
      try {
        const progressDoc = await getDoc(doc(db, 'vocabularyProgress', userId));
        
        if (progressDoc.exists()) {
          const progressData = progressDoc.data() as VocabularyProgress;
          const { words } = get();
          
          // Update existing words with user progress
          // If a word is not in progressData.wordsProgress, it defaults to "toLearn"
          const updatedWords = words.map(word => ({
            ...word,
            status: progressData.wordsProgress[word.id] || 'toLearn' as WordStatus
          }));
          
          // Recalculate cached progress
          const { categoryProgress, levelProgress } = calculateProgressData(updatedWords);
          
          set({ 
            words: updatedWords, 
            progress: { ...progressData, userId }, 
            categoryProgress,
            levelProgress,
            loading: false 
          });
        } else {
          // No progress exists, all words default to "toLearn"
          const { words } = get();
          const defaultWords = words.map(word => ({
            ...word,
            status: 'toLearn' as WordStatus
          }));
          
          const newProgress: VocabularyProgress = {
            userId,
            wordsProgress: {} // Empty object since all words are toLearn
          };
          
          // Recalculate cached progress
          const { categoryProgress, levelProgress } = calculateProgressData(defaultWords);
          
          set({ 
            words: defaultWords,
            progress: newProgress,
            categoryProgress,
            levelProgress,
            loading: false 
          });
        }
      } catch (error) {
        console.error('Error loading user vocabulary progress:', error);
        set({ loading: false });
      }
    },

    saveUserProgress: async (db, userId) => {
      const { progress } = get();
      
      if (!progress) {
        return;
      }
      
      try {
        await setDoc(doc(db, 'vocabularyProgress', userId), {
          ...progress,
          userId,
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error saving vocabulary progress:', error);
        throw error;
      }
    },

    initializeWords: (userId) => {
      // Only re-initialize if words are empty or user changed
      const { words, progress } = get();
      
      if (words.length === 0 || (progress?.userId !== userId && userId)) {
        const wordsWithIds = defaultVocabularyWords.map(word => {
          const wordId = `${word.word}_${word.category}_${word.level}`;
          return {
            id: wordId,
            word: word.word,
            definition: word.definition,
            example: word.example,
            hebrewTranslation: word.hebrewTranslation,
            category: word.category,
            level: word.level,
            status: 'toLearn' as WordStatus, // All words start as toLearn
            createdAt: new Date(),
            updatedAt: new Date(),
          } as VocabularyWord;
        });
        
        const newProgress: VocabularyProgress = {
          userId: userId || '',
          wordsProgress: {} // Empty object since all words start as toLearn
        };
        
        // Calculate initial progress
        const { categoryProgress, levelProgress } = calculateProgressData(wordsWithIds);
        
        set({ 
          words: wordsWithIds, 
          progress: newProgress,
          categoryProgress,
          levelProgress,
          loading: false 
        });
      }
    },

    calculateProgress: () => {
      const { words } = get();
      const { categoryProgress, levelProgress } = calculateProgressData(words);
      set({ categoryProgress, levelProgress });
    },

    resetProgress: () => {
      set({ 
        words: [], 
        progress: null,
        categoryProgress: {},
        levelProgress: {},
        loading: false 
      });
    },
  };
}); 
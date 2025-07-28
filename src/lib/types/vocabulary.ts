type WordStatus = 'learned' | 'learning' | 'toLearn';

interface VocabularyWord {
  id: string;
  word: string;
  definition: string;
  example: string;
  hebrewTranslation: string;
  status: WordStatus;
  level: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

interface VocabularyProgress {
    userId: string;
    wordsProgress: Record<string, WordStatus>;
}

interface VocabularyQuiz {
    id: string;
    userId: string;
    words: VocabularyWord[];
    createdAt: Date;
    updatedAt: Date;
}


export type { VocabularyWord, VocabularyProgress, WordStatus, VocabularyQuiz };
import { create } from 'zustand';
import { Question } from '@/lib/types/question';
import QuestionHandler from '@/backend/dal/question';
import { Firestore } from 'firebase/firestore';

interface QuestionStore {
  questions: Question[];
  questionsByType: Record<string, Question[]>;
  loading: boolean;
  fetchAllQuestions: (db: Firestore) => Promise<void>;
  fetchQuestionsByType: (db: Firestore, type: string) => Promise<void>;
}

export const useQuestionStore = create<QuestionStore>((set) => ({
  questions: [],
  questionsByType: {},
  loading: false,
  fetchAllQuestions: async (db) => {
    set({ loading: true });
    const handler = new QuestionHandler(db);
    const all = await handler.fetchAllQuestions();
    set({ questions: all, loading: false });
  },
  fetchQuestionsByType: async (db, type) => {
    set({ loading: true });
    const handler = new QuestionHandler(db);
    const byType = await handler.fetchQuestionsByType(type);
    set(state => ({
      questionsByType: { ...state.questionsByType, [type]: byType },
      loading: false,
    }));
  },
})); 
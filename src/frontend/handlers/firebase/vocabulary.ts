import { VocabularyProgress, WordStatus } from "@/lib/types/vocabulary";
import { Firestore, doc, setDoc, getDoc, updateDoc, deleteField } from "firebase/firestore";

class VocabularyHandler {
    constructor(private db: Firestore) {}

    /**
     * Save user's vocabulary progress to Firestore
     */
    async saveUserProgress(userId: string, progress: VocabularyProgress) {
        try {
            const progressRef = doc(this.db, "vocabularyProgress", userId);
            await setDoc(progressRef, {
                ...progress,
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error saving vocabulary progress:', error);
            throw error;
        }
    }

    /**
     * Load user's vocabulary progress from Firestore
     */
    async getUserProgress(userId: string): Promise<VocabularyProgress | null> {
        try {
            const progressRef = doc(this.db, "vocabularyProgress", userId);
            const progressDoc = await getDoc(progressRef);
            
            if (progressDoc.exists()) {
                return progressDoc.data() as VocabularyProgress;
            }
            return null;
        } catch (error) {
            console.error('Error loading vocabulary progress:', error);
            throw error;
        }
    }

    /**
     * Update a specific word's status for a user
     */
    async updateWordStatus(userId: string, wordId: string, status: WordStatus) {
        try {
            const progressRef = doc(this.db, "vocabularyProgress", userId);
            
            // First check if document exists
            const progressDoc = await getDoc(progressRef);
            
            if (progressDoc.exists()) {
                if (status === 'toLearn') {
                    // Remove the word from progress if it's set back to toLearn
                    const updateData = {
                        [`wordsProgress.${wordId}`]: deleteField(),
                        updatedAt: new Date()
                    };
                    await updateDoc(progressRef, updateData);
                } else {
                    // Update existing document with learned/learning status
                    await updateDoc(progressRef, {
                        [`wordsProgress.${wordId}`]: status,
                        updatedAt: new Date()
                    });
                }
            } else {
                // Create new document only if status is not toLearn
                if (status !== 'toLearn') {
                    const newProgress: VocabularyProgress = {
                        userId,
                        wordsProgress: { [wordId]: status }
                    };
                    await setDoc(progressRef, {
                        ...newProgress,
                        updatedAt: new Date()
                    });
                }
                // If status is toLearn and no document exists, do nothing (toLearn is default)
            }
        } catch (error) {
            console.error('Error updating word status:', error);
            throw error;
        }
    }

    /**
     * Get user's progress for a specific category
     */
    async getCategoryProgress(userId: string, category: string): Promise<Record<string, WordStatus>> {
        try {
            const progress = await this.getUserProgress(userId);
            if (!progress) return {};
            
            // Filter words by category (wordId format: word_category_level)
            const categoryProgress: Record<string, WordStatus> = {};
            
            Object.entries(progress.wordsProgress).forEach(([wordId, status]) => {
                const [, wordCategory] = wordId.split('_');
                if (wordCategory === category) {
                    categoryProgress[wordId] = status;
                }
            });
            
            return categoryProgress;
        } catch (error) {
            console.error('Error getting category progress:', error);
            throw error;
        }
    }

    /**
     * Get user's progress for a specific level
     */
    async getLevelProgress(userId: string, level: number): Promise<Record<string, WordStatus>> {
        try {
            const progress = await this.getUserProgress(userId);
            if (!progress) return {};
            
            // Filter words by level (wordId format: word_category_level)
            const levelProgress: Record<string, WordStatus> = {};
            
            Object.entries(progress.wordsProgress).forEach(([wordId, status]) => {
                const parts = wordId.split('_');
                const wordLevel = parseInt(parts[parts.length - 1]);
                if (wordLevel === level) {
                    levelProgress[wordId] = status;
                }
            });
            
            return levelProgress;
        } catch (error) {
            console.error('Error getting level progress:', error);
            throw error;
        }
    }

    /**
     * Reset user's vocabulary progress
     */
    async resetUserProgress(userId: string) {
        try {
            const progressRef = doc(this.db, "vocabularyProgress", userId);
            await setDoc(progressRef, {
                userId,
                wordsProgress: {},
                updatedAt: new Date()
            });
        } catch (error) {
            console.error('Error resetting vocabulary progress:', error);
            throw error;
        }
    }
}

export default VocabularyHandler;
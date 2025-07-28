import { Firestore, collection, getDocs } from 'firebase/firestore';
import { Question } from '@/lib/types/question';

class QuestionHandler {
  constructor(private db: Firestore) {}

  async fetchAllQuestions() {
    const querySnapshot = await getDocs(collection(this.db, 'questions'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
  }

  async fetchQuestionsByType(type: string) {
    const all = await this.fetchAllQuestions();
    return all.filter(q => q.type === type);
  }

  async fetchQuestionsByPassageId(passageId: string) {
    const all = await this.fetchAllQuestions();
    return all.filter(q => q.passageId === passageId);
  }
}

export default QuestionHandler;




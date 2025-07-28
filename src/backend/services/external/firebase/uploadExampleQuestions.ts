import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { firebaseConfig } from './firebase';
import { QuestionType } from '@/lib/types/question';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

const exampleQuestions = [
  // Sentence Completion
  {
    text: 'The culinary term chiffonade refers to vegetables that have been shredded or __________ into strips.',
    options: ['sliced', 'sipped', 'stored', 'switched'],
    correctAnswer: 0,
    type: QuestionType.SentenceCompletion,
  },
  {
    text: 'She __________ her keys on the table.',
    options: ['left', 'leave', 'leaving', 'leaves'],
    correctAnswer: 0,
    type: QuestionType.SentenceCompletion,
  },
  // Text and Questions (passage 1)
  {
    text: 'Read the following passage and answer the question: "The Industrial Revolution was a period of major industrialization and innovation during the late 18th and early 19th centuries. The Industrial Revolution began in Great Britain and quickly spread to the rest of the world." What was the Industrial Revolution?',
    options: ['A war', 'A period of industrialization', 'A political movement', 'A religious event'],
    correctAnswer: 1,
    type: QuestionType.TextAndQuestions,
    passageId: 'passage-1',
  },
  {
    text: 'Based on the passage above, where did the Industrial Revolution begin?',
    options: ['France', 'Germany', 'Great Britain', 'United States'],
    correctAnswer: 2,
    type: QuestionType.TextAndQuestions,
    passageId: 'passage-1',
  },
  // Restatement
  {
    text: 'Restate the following: "The cat is on the mat."',
    options: ['A feline is sitting on a rug', 'The dog is under the chair', 'A cat is lying on the floor', 'The mat has a cat'],
    correctAnswer: 0,
    type: QuestionType.Restatement,
  },
  {
    text: 'Restate: "She loves reading books."',
    options: ['Books are her passion', 'She enjoys literature', 'Reading is her hobby', 'All of the above'],
    correctAnswer: 3,
    type: QuestionType.Restatement,
  },
];

export async function uploadExampleQuestionsIfNeeded() {
  const snapshot = await getDocs(collection(db, 'questions'));
  if (!snapshot.empty) {
    console.log('Questions already exist, skipping upload.');
    return;
  }
  for (const q of exampleQuestions) {
    await addDoc(collection(db, 'questions'), {
      ...q,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      // Add passageId if needed for text questions!
    });
  }
  console.log('Example questions uploaded.');
} 
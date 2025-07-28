export enum QuestionType {
  SentenceCompletion = 'Sentence Completion',
  Restatement = 'Restatement',
  TextAndQuestions = 'Text and Questions',
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type: QuestionType;
  createdAt: Date;
  updatedAt: Date;
  passageId?: string;
}
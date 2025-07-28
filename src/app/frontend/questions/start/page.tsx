'use client';

import PageTitle from '@/frontend/components/PageTitle';
import { db } from '@/backend/services/external/firebase/firebase';
import SimulationsHandler from '@/frontend/handlers/firebase/simulations';
import { useAuth } from '@/frontend/hooks/use-auth';
import { useEffect, useState } from 'react';
import { Question } from '@/lib/types/question';
import { useSimulationStore } from '@/frontend/stores/simulation-store';
import { QuestionType } from '@/lib/types/question';
import SimulationRunPage from '@/frontend/components/ui/pages/simulations/simulationRunPage';

const QUESTION_TYPES = [
  { key: QuestionType.SentenceCompletion, label: 'Sentence Completion' },
  { key: QuestionType.Restatement, label: 'Restatement' },
  { key: QuestionType.TextAndQuestions, label: 'Text and Questions' },
];

function QuestionsStartPage() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<QuestionType>(QuestionType.SentenceCompletion);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [progress, setProgress] = useState<Record<string, { completed: number; total: number }>>({});
  const [loading, setLoading] = useState(false);
  const fetchQuiz = useSimulationStore(state => state.fetchQuiz);
  const simulationLoading = useSimulationStore(state => state.simulationLoading);
  const currentSimulation = useSimulationStore(state => state.currentSimulation);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!db) return;
    const handler = new SimulationsHandler(db);
    (async () => {
      const newProgress: Record<string, { completed: number; total: number }> = {};
      for (const type of QUESTION_TYPES) {
        const qs = await handler.fetchQuestionsByType(type.key);
        newProgress[type.key] = { completed: 0, total: qs.length };
      }
      setProgress(newProgress);
    })();
  }, [user]);

  useEffect(() => {
    if (!db || !selectedType) return;
    const handler = new SimulationsHandler(db);
    setLoading(true);
    handler.fetchQuestionsByType(selectedType).then(qs => {
      setQuestions(qs);
      setLoading(false);
    });
  }, [selectedType]);

  const handleStartQuiz = () => {
    if (db && selectedType) {
      fetchQuiz(db, selectedType);
      setQuizStarted(true);
    }
  };

  if (simulationLoading) return <div>Loading quiz...</div>;
  if (quizStarted && currentSimulation) return <SimulationRunPage simulation={currentSimulation} />;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto">
        <PageTitle title="Questions Practice" subtitle="Choose a type and start practicing" color="blue" />
        <div className="flex flex-col gap-6 mt-10">
          {QUESTION_TYPES.map(type => (
            <button
              key={type.key}
              className={`rounded-xl p-6 border shadow flex items-center justify-between transition-all duration-200 ${selectedType === type.key ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-200 hover:bg-blue-50'}`}
              onClick={() => setSelectedType(type.key as QuestionType)}
            >
              <span className="font-semibold text-lg">{type.label}</span>
              <span className="text-sm text-gray-600">
                {progress[type.key]?.completed ?? 0} / {progress[type.key]?.total ?? 0} completed
              </span>
            </button>
          ))}
        </div>
        <div className="mt-10">
          <h2 className="text-xl font-bold mb-4">{selectedType} Questions</h2>
          {loading ? (
            <div>Loading questions...</div>
          ) : (
            <ul className="space-y-4">
              {questions.map(q => (
                <li key={q.id} className="p-4 bg-white rounded-lg border shadow">
                  <div className="font-medium mb-2">{q.text}</div>
                  <ul className="list-disc ml-6">
                    {q.options?.map((opt: string, i: number) => (
                      <li key={i}>{opt}</li>
                    ))}
                  </ul>
                </li>
              ))}
              {questions.length === 0 && <li>No questions found for this type.</li>}
            </ul>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <button className="btn btn-primary px-8 py-3 text-lg" onClick={handleStartQuiz}>
            Start Quiz for {QUESTION_TYPES.find(t => t.key === selectedType)?.label}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionsStartPage;
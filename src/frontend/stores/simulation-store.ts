import { create } from 'zustand';
import Simulation from '@/lib/types/simulation';
import SimulationsHandler, { UserSimulationsAnswersHandler } from '@/frontend/handlers/firebase/simulations';
import { Firestore } from 'firebase/firestore';
import { Question, QuestionType } from '@/lib/types/question';

interface SimulationHistoryItem {
  id: string;
  simulationId: string;
  answers: number[];
  timestamp: number;
  simulation?: Simulation | null;
}

interface SimulationStore {
  simulations: Simulation[];
  currentSimulation: Simulation | null;
  simulationQuestions: Question[];
  simulationLoading: boolean;
  userAnswers: number[];
  history: SimulationHistoryItem[];
  historyLoading: boolean;
  setCurrentSimulation: (sim: Simulation | null) => void;
  setSimulationQuestions: (questions: Question[]) => void;
  setUserAnswers: (answers: number[]) => void;
  fetchSimulations: (db: Firestore) => Promise<void>;
  fetchSimulationById: (db: Firestore, id: string) => Promise<void>;
  fetchQuiz: (db: Firestore, type: QuestionType, count?: number, timeInSeconds?: number) => Promise<void>;
  fetchHistory: (db: Firestore, userId: string) => Promise<void>;
  saveSimulationResult: (db: Firestore, userId: string, simulationId: string, answers: number[]) => Promise<void>;
}

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  simulations: [],
  currentSimulation: null,
  simulationQuestions: [],
  simulationLoading: false,
  userAnswers: [],
  history: [],
  historyLoading: false,
  setCurrentSimulation: (sim) => set({ currentSimulation: sim }),
  setSimulationQuestions: (questions) => set({ simulationQuestions: questions }),
  setUserAnswers: (answers) => set({ userAnswers: answers }),
  fetchSimulations: async (db) => {
    const simHandler = new SimulationsHandler(db);
    const sims = await simHandler.listSimulations();
    set({ simulations: sims });
  },
  fetchSimulationById: async (db, id) => {
    set({ simulationLoading: true });
    const simHandler = new SimulationsHandler(db);
    let simId = id;
    let sim: Simulation;
    if (id) {
      sim = await simHandler.getSimulation(id);
    } else {
      sim = await simHandler.generateSimulation() as Simulation;
      simId = await simHandler.createSimulation(sim);
      (sim as Simulation).id = simId;
      console.log('Generated and saved simulation:', { simId, sim });
    }
    // Flatten all questions from all stages for simulationQuestions
    const mappedQuestions = sim.stages.flatMap(stage => stage.questions);
    set({ currentSimulation: sim, simulationQuestions: mappedQuestions, simulationLoading: false });
  },
  fetchQuiz: async (db, type, count = 5, timeInSeconds = 3 * 60) => {
    set({ simulationLoading: true });
    const simHandler = new SimulationsHandler(db);
    const sim = await simHandler.generateQuiz(type, count, timeInSeconds) as Simulation;
    const simId = await simHandler.createSimulation(sim);
    (sim as Simulation).id = simId;
    const mappedQuestions = sim.stages.flatMap(stage => stage.questions);
    set({ currentSimulation: sim, simulationQuestions: mappedQuestions, simulationLoading: false });
  },
  fetchHistory: async (db, userId) => {
    set({ historyLoading: true });
    const userAnswersHandler = new UserSimulationsAnswersHandler(db);
    const simHandler = new SimulationsHandler(db);
    const history = await userAnswersHandler.getUserSimulationHistory(userId);
    console.log('Raw history from Firestore:', history);
    
    // Fetch simulation details for each history entry
    const historyWithDetails = await Promise.all(
      history.map(async (entry: Record<string, unknown>) => {
        try {
          const simulation = await simHandler.getSimulation(entry.simulationId as string);
          console.log('Fetched simulation for history:', { simulationId: entry.simulationId, simulation });
          return {
            id: entry.id as string,
            simulationId: entry.simulationId as string,
            answers: (entry.answers as number[]) || [],
            timestamp: entry.timestamp as number,
            simulation: simulation,
          } as SimulationHistoryItem;
        } catch (error) {
          console.error(`Failed to fetch simulation ${entry.simulationId}:`, error);
          return {
            id: entry.id as string,
            simulationId: entry.simulationId as string,
            answers: (entry.answers as number[]) || [],
            timestamp: entry.timestamp as number,
            simulation: null,
          } as SimulationHistoryItem;
        }
      })
    );
    
    console.log('Final history with details:', historyWithDetails);
    set({ history: historyWithDetails, historyLoading: false });
  },
  saveSimulationResult: async (db, userId, simulationId, answers) => {
    console.log('Saving simulation result:', { userId, simulationId, answers });
    const userSimHandler = new UserSimulationsAnswersHandler(db);
    await userSimHandler.saveUserSimulationAnswer(userId, simulationId, answers);
    console.log('Simulation result saved, fetching updated history...');
    await get().fetchHistory(db, userId);
  },
})); 
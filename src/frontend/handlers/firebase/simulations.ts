import Simulation from "@/lib/types/simulation";
import { Firestore, collection, addDoc, getDoc, doc, updateDoc, getDocs, setDoc, Timestamp } from "firebase/firestore";
import { Question, QuestionType } from "@/lib/types/question";

// const simulationsCollection = (db: Firestore) => collection(db, "simulations");
// const userSimulationsAnswersCollection = (db: Firestore) => collection(db, "userSimulationsAnswers");

class SimulationsHandler {
    constructor(private db: Firestore) {}

    async createSimulation(simulation: Simulation) {
        const docRef = await addDoc(collection(this.db, "simulations"), simulation);
        return docRef.id;
    }

    async getSimulation(id: string) {
        const docRef = await getDoc(doc(this.db, "simulations", id));
        if (!docRef.exists()) {
            throw new Error(`Simulation with id ${id} not found`);
        }
        const data = docRef.data();
        if (!data) {
            throw new Error(`Simulation data is empty for id ${id}`);
        }
        
        // Convert Firestore timestamps to Date objects and ensure proper structure
        const simulation = {
            id: docRef.id,
            name: data.name || 'Unknown Simulation',
            description: data.description || '',
            stages: data.stages?.map((stage: Record<string, unknown>) => ({
                type: stage.type as QuestionType,
                questions: (stage.questions as Record<string, unknown>[])?.map((q: Record<string, unknown>) => ({
                    id: q.id as string || '',
                    text: q.text as string || '',
                    options: q.options as string[] || [],
                    correctAnswer: q.correctAnswer as number || 0,
                    type: q.type as QuestionType,
                    passageId: q.passageId as string,
                    createdAt: (q.createdAt as Timestamp)?.toDate() || new Date(),
                    updatedAt: (q.updatedAt as Timestamp)?.toDate() || new Date(),
                })) || [],
                timeInSeconds: stage.timeInSeconds as number || 0,
            })) || [],
            createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
            updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date(),
        };
        
        return simulation as Simulation;
    }
    
    async updateSimulation(id: string, data: Partial<Simulation>) {
        const docRef = doc(this.db, "simulations", id);
        await updateDoc(docRef, data);
    }

    async listSimulations() {
        const querySnapshot = await getDocs(collection(this.db, "simulations"));
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Simulation[];
    }

    /**
     * Generate a full simulation with all stages (passages, restatement, sentence completion)
     */
    async generateSimulation({
        sentenceCompletionCount = 5,
        restatementCount = 4,
        passageCount = 2,
        passageTime = 5 * 60,
        restatementTime = 4 * 60,
        sentenceCompletionTime = 3 * 60,
    } = {}) {
        const querySnapshot = await getDocs(collection(this.db, "questions"));
        const allQuestions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text || '',
                options: data.options || [],
                correctAnswer: data.correctAnswer || 0,
                type: data.type as QuestionType,
                passageId: data.passageId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Question;
        });

        // Group by type (using enum)
        const sentenceCompletion = allQuestions.filter(q => q.type === QuestionType.SentenceCompletion);
        const restatement = allQuestions.filter(q => q.type === QuestionType.Restatement);
        const textQuestions = allQuestions.filter(q => q.type === QuestionType.TextAndQuestions);

        console.log('Question filtering results:', {
            total: allQuestions.length,
            sentenceCompletion: sentenceCompletion.length,
            restatement: restatement.length,
            textQuestions: textQuestions.length
        });

        // Group text questions by passageId
        const passagesMap: { [passageId: string]: Question[] } = {};
        for (const q of textQuestions) {
            if (!q.passageId) continue;
            if (!passagesMap[q.passageId]) passagesMap[q.passageId] = [];
            passagesMap[q.passageId].push(q);
        }
        const passageGroups = Object.values(passagesMap).filter(g => g.length > 0);

        // Randomize helper
        function getRandomItems<T>(arr: T[], n: number): T[] {
            const shuffled = arr.slice().sort(() => Math.random() - 0.5);
            return shuffled.slice(0, n);
        }

        // Select random passages
        const selectedPassages = getRandomItems(passageGroups, passageCount);
        // Select random restatement and sentence completion
        const selectedRestatement = getRandomItems(restatement, restatementCount);
        const selectedSentenceCompletion = getRandomItems(sentenceCompletion, sentenceCompletionCount);

        // Build stages: each passage group is a stage, then restatement, then sentence completion
        const stages = [
            ...selectedPassages.map(questions => ({
                type: QuestionType.TextAndQuestions,
                questions,
                timeInSeconds: passageTime,
            })),
            {
                type: QuestionType.Restatement,
                questions: selectedRestatement,
                timeInSeconds: restatementTime,
            },
            {
                type: QuestionType.SentenceCompletion,
                questions: selectedSentenceCompletion,
                timeInSeconds: sentenceCompletionTime,
            },
        ];

        const simulation = {
            name: "Generated Simulation",
            description: "Auto-generated simulation",
            stages,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return simulation;
    }

    /**
     * Generate a quiz for a single question type (shorter, focused practice)
     * @param type QuestionType
     * @param count number of questions
     * @param timeInSeconds time for the quiz
     */
    async generateQuiz(type: QuestionType, count = 5, timeInSeconds = 3 * 60) {
        const querySnapshot = await getDocs(collection(this.db, "questions"));
        const allQuestions = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text || '',
                options: data.options || [],
                correctAnswer: data.correctAnswer || 0,
                type: data.type as QuestionType,
                passageId: data.passageId,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as Question;
        });
        let questions: Question[] = [];
        if (type === QuestionType.TextAndQuestions) {
            // For text questions, group by passage and pick one group
            const textQuestions = allQuestions.filter(q => q.type === QuestionType.TextAndQuestions);
            const passagesMap: { [passageId: string]: Question[] } = {};
            for (const q of textQuestions) {
                if (!q.passageId) continue;
                if (!passagesMap[q.passageId]) passagesMap[q.passageId] = [];
                passagesMap[q.passageId].push(q);
            }
            const passageGroups = Object.values(passagesMap).filter(g => g.length > 0);
            if (passageGroups.length > 0) {
                questions = passageGroups[Math.floor(Math.random() * passageGroups.length)];
            }
        } else {
            questions = allQuestions.filter(q => q.type === type);
            // Randomize and pick count
            questions = questions.sort(() => Math.random() - 0.5).slice(0, count);
        }
        const quiz = {
            name: `Quiz: ${type}`,
            description: `Quiz for ${type}`,
            stages: [
                {
                    type,
                    questions,
                    timeInSeconds,
                },
            ],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return quiz;
    }

    /**
     * Fetch all questions of a given type. If type is 'Text and Questions' and passageId is provided, filter by passageId.
     */
    async fetchQuestionsByType(type: string, passageId?: string) {
        const querySnapshot = await getDocs(collection(this.db, "questions"));
        let questions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Question[];
        questions = questions.filter(q => q.type === type);
        if (type === "Text and Questions" && passageId) {
            questions = questions.filter(q => q.passageId === passageId);
        }
        return questions;
    }
}

class UserSimulationsAnswersHandler {
    constructor(private db: Firestore) {}

    async saveUserSimulationAnswer(userId: string, simulationId: string, answers: number[]) { // TODO: Use richer answer type if needed
        const docRef = doc(this.db, "userSimulationsAnswers", `${userId}_${simulationId}`);
        await setDoc(docRef, { userId, simulationId, answers, timestamp: Date.now() });
    }

    async getUserSimulationHistory(userId: string) {
        const querySnapshot = await getDocs(collection(this.db, "userSimulationsAnswers"));
        return querySnapshot.docs
            .filter(doc => doc.data().userId === userId)
            .map(doc => ({ id: doc.id, ...doc.data() }));
    }
}

export { UserSimulationsAnswersHandler };

export default SimulationsHandler;
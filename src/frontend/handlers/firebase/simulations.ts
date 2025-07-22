import Simulation from "@/lib/types/simulation";
import { Firestore, collection, addDoc, getDoc, doc } from "firebase/firestore";

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
        return docRef.data() as Simulation;
    }
    
}

export default SimulationsHandler;
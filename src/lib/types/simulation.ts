import { Question, QuestionType } from "./question";

interface SimulationStage {
  type: QuestionType;
  questions: Question[];
  timeInSeconds: number;
}

interface Simulation {
  id?: string;
  name: string;
  description: string;
  stages: SimulationStage[];
  createdAt: Date;
  updatedAt: Date;
}

export default Simulation;
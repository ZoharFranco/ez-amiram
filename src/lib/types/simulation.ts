import Question from "./question";

interface Simulation {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
}

export default Simulation;
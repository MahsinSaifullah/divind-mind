export interface IAnswer {
  answer: string;
  isCorrect: boolean;
}

export interface IQuestion {
  question: string;
  answers: IAnswer[];
}

export interface IQuiz {
  id: string;
  title: string;
  timeLimit: number;
  scorePerQuestion: number;
  questions: IQuestion[];
}

export interface IGame {
  id: string;
  code: string;
  creatorId: string;
  players: string[];
  maxPlayerLimit: number;
  quizes: IQuiz[];
}

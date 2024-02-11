import { Socket } from 'socket.io';
import { IAnswer, IQuestion, IUser } from '../../types';

export interface ServerToClientEvents {
  quizStarted: (message: string) => void;
  sendQuestion: (question: IQuestion) => void;
  sendAnswer: (user: IUser, answer: IAnswer) => void;
  timeOut: () => void;
  quizEnded: () => void;
}

export interface ClientToServerEvents {
  startQuiz: (code: string, quizTitle: string) => void;
  joinGame: (user: IUser) => void;
  startQuestion: (question: IQuestion) => void;
  sendAnswer: (answer: string) => void;
  timeOut: () => void;
  endQuiz: () => void;
}

export interface SocketData {
  code: string;
  user: IUser;
}

export type CustomSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>;

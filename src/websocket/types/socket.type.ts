import { Socket } from 'socket.io';
import { IQuestion, IUser } from '../../types';
import { IModifiedQuestion } from './game.type';

export interface ServerToClientEvents {
  quizStarted: (message: string) => void;
  sendQuestion: (question: IModifiedQuestion) => void;
  sendAnswer: (user: IUser, answer: string) => void; 
  timeOut: () => void;
}

export interface ClientToServerEvents {
  startQuiz: (code: string, quizTitle: string) => void;
  joinGame: (user: IUser) => void;
  startQuestion: (question: IQuestion) => void;
  sendAnswer: (answer: string) => void;
  timeOut: () => void;
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

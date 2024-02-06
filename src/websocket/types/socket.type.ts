import { Socket } from 'socket.io';
import { IQuiz } from '../../types';

export interface ServerToClientEvents {
  quizStarted: (message: string) => void;
}

export interface ClientToServerEvents {
  startQuiz: (code: string, quizTitle: string) => void;
  joinGame: (code: string) => void;
}

export interface SocketData {
  code: string;
}

export type CustomSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  object,
  SocketData
>;

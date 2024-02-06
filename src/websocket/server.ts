import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { gameHandler } from './handlers';
import {
  ClientToServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types';
import { authService } from '../services';
import { IUser } from '../types';

export const websocketServer = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new SocketIOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    object,
    SocketData
  >(server, {
    cors: {
      origin: '*',
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const user = authService.decodeJWT(token) as IUser;

      if (!user) {
        throw new Error();
      }
      socket.data.user = user;
      return next();
    } catch (error) {
      return next(new Error('Invalid authentication credentials.'));
    }
  });

  io.on(
    'connection',
    (
      socket: Socket<
        ClientToServerEvents,
        ServerToClientEvents,
        object,
        SocketData
      >
    ) => {
      if (socket.data.user.type === 'creator') {
        socket.join('creator-room');
      }

      socket.on('startQuiz', (code, quizTitle) =>
        gameHandler.startQuiz(socket, code, quizTitle)
      );
      socket.on('joinGame', () => gameHandler.joinGame(socket));
      socket.on('startQuestion', (question) =>
        gameHandler.startQuestion(socket, question)
      );
      socket.on('sendAnswer', (answer) =>
        gameHandler.sendAnswer(socket, answer)
      );
      socket.on('timeOut', () => gameHandler.timeOut(socket));
      socket.on('endQuiz', () => gameHandler.endQuiz(socket));
    }
  );
};

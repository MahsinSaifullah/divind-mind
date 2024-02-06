import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { gameHandler } from './handlers';
import { ClientToServerEvents, ServerToClientEvents, SocketData } from './types';


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

  io.on('connection', (socket: Socket<ClientToServerEvents, ServerToClientEvents, object, SocketData>) => {
    console.log('A User is connected');

    socket.on('startQuiz', (code, quizTitle) => gameHandler.startQuiz(socket, code, quizTitle));
    socket.on('joinGame', (code) => gameHandler.joinGame(socket, code));
  });
};

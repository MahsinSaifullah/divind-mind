import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { gameHandler } from './handlers';

interface ServerToClientEvents {}

interface ClientToServerEvents {
  startGame: (code: string) => void;
}

interface SocketData {}

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

  io.on('connection', (socket) => {
    console.log('A User is connected');

    socket.on('startGame', gameHandler.startGame);
  });
};

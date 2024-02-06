import { IncomingMessage, Server, ServerResponse } from 'http';
import { Server as SocketIOServer } from 'socket.io';

export const websocketServer = (
  server: Server<typeof IncomingMessage, typeof ServerResponse>
) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('A User is connected');
  });
};

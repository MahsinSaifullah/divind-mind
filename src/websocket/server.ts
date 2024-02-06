import { Server } from 'socket.io';
import { server } from '../server';

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('Connection', (socket) => {
    console.log('A User is connected')
})

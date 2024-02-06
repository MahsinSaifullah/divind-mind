import { CustomSocket } from "websocket/types";

const startQuiz = (socket: CustomSocket, code: string, quizTitle: string) => {
  socket.data.code = code
  socket.join(code)
  socket.to(code).emit('quizStarted',`Quiz: ${quizTitle} has started!!! Are you ready?`)
};

const joinGame = (socket: CustomSocket, code: string) => {
  socket.join(code)
};

export const gameHandler = {
  startQuiz,
  joinGame
};

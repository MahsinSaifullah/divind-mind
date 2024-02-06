import { IQuestion, IUser } from '../../types';
import { CustomSocket } from '../types';
import { IModifiedQuestion } from '../types';

const startQuiz = (socket: CustomSocket, code: string, quizTitle: string) => {
  socket.data.code = code;
  socket.join(code);
  socket
    .to(code)
    .emit('quizStarted', `Quiz: ${quizTitle} has started!!! Are you ready?`);
};

const joinGame = (socket: CustomSocket) => {
  if (!socket.data.user.code) {
    return;
  }

  socket.join(socket.data.user.code);
};

const startQuestion = (socket: CustomSocket, question: IQuestion) => {
  const questionToSend: IModifiedQuestion = {
    question: question.question,
    answers: question.answers.map((answer) => answer.answer),
  };

  socket.to(socket.data.code).emit('sendQuestion', questionToSend);
};

const sendAnswer = (socket: CustomSocket, answer: string) => {
  if (!socket.data.user.code) {
    return;
  }

  socket.to('creator-room').emit('sendAnswer', socket.data.user, answer);
};

const timeOut = (socket: CustomSocket) => {
  socket.to(socket.data.code).emit('timeOut');
};

const endQuiz = (socket: CustomSocket) => {
  socket.to(socket.data.code).emit('quizEnded');
};

export const gameHandler = {
  startQuiz,
  joinGame,
  startQuestion,
  sendAnswer,
  timeOut,
  endQuiz
};

import mongoose from 'mongoose';

import { gameConfig } from '../configs';
import { IAnswer, IGame, IQuestion, IQuiz } from 'types';

const answerSchema = new mongoose.Schema<IAnswer>({
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema<IQuestion>({
  question: { type: String, required: true },
  answers: [answerSchema],
});

const quizSchema = new mongoose.Schema<IQuiz>({
  title: { type: String, required: true },
  timeLimit: { type: Number, default: gameConfig.defaultTimeLimit },
  scorePerQuestion: { type: Number, default: gameConfig.defaultScorePerQuestion },
  questions: [questionSchema],
});

const gameSchema = new mongoose.Schema<IGame>({
  code: { type: String, required: true },
  creatorId: {
    type: String,
    ref: 'user',
    required: true,
  },
  players: [{ type: String, ref: 'user' }],
  maxPlayerLimit: { type: Number, default: gameConfig.defaultPlayersLimit },
  quizes: [quizSchema],
});

export const gameModel = mongoose.model<IGame>('Game', gameSchema);

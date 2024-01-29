import { gameConfig } from '../configs';
import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  answer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answers: [answerSchema],
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  questions: [questionSchema],
});

const gameSchema = new mongoose.Schema({
  code: { type: String, required: true },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  maxPlayerLimit: { type: Number, default: gameConfig.defaultPlayersLimit },
  quizes: [quizSchema],
});

export const gameModel = mongoose.model('Game', gameSchema);

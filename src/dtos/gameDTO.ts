import { Document, Types } from 'mongoose';
import { IGame, IQuestion, IQuiz } from '../types';

export const gameDTO = (
  gameDoc: Document<unknown, {}, IGame> &
    IGame & {
      _id: Types.ObjectId;
    }
): IGame => {
  const quizes: IQuiz[] = gameDoc.quizes.map((quiz) => ({
    id: (
      quiz as Document<unknown, {}, IQuiz> &
        IQuiz & {
          _id: Types.ObjectId;
        }
    )._id as unknown as string,
    title: quiz.title,
    timeLimit: quiz.timeLimit,
    questions: quiz.questions as unknown as IQuestion[],
  }));

  return {
    id: gameDoc._id as unknown as string,
    code: gameDoc.code,
    creatorId: gameDoc.creatorId as unknown as string,
    players: gameDoc.players as unknown as string[],
    maxPlayerLimit: gameDoc.maxPlayerLimit,
    quizes,
  };
};

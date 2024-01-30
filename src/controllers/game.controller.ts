import { Request, Response } from 'express';
import { gameService, validationService } from 'services';
import { IGame, IQuiz } from 'types';

const createNewGame = async (req: Request, res: Response) => {
  try {
    validationService.validateGameRequestBody(req.body);

    if (!(await gameService.isGameCodeUnique(req.body.code))) {
      throw new Error('Code must be unique');
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(400).json({ error: error.message, status: 400 });
  }

  try {
    const newGame = await gameService.createGame(req.body);

    const newGameDTO: IGame = {
      id: newGame._id as unknown as string,
      code: newGame.code,
      creatorId: newGame.creatorId as unknown as string,
      players: newGame.players as unknown as string[],
      maxPlayerLimit: newGame.maxPlayerLimit,
      quizes: newGame.quizes as unknown as IQuiz[],
    };

    res.status(201).json(newGameDTO);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Unable to create game due to a server issue',
      status: 500,
    });
  }
};

export const gameController = {
  createNewGame,
};

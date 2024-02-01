import { Request, Response } from 'express';

import { gameService, validationService } from '../services';
import { IGame, IQuiz } from '../types';

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
    const newGame = await gameService.createGame({
      ...req.body,
      creatorId: req.user!.id,
    });

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

const getAllGamesForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(403).json({ error: 'User does not exist' });
    }

    const gamesByUser = await gameService.getAllGamesByCreatorId(userId);
    const gameDTOs: IGame[] = gamesByUser.map((game) => ({
      id: game._id as unknown as string,
      code: game.code,
      creatorId: game.creatorId as unknown as string,
      players: game.players as unknown as string[],
      maxPlayerLimit: game.maxPlayerLimit,
      quizes: game.quizes as unknown as IQuiz[],
    }));

    res.send(200).json(gameDTOs);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Unable to fetch games due to a server issue',
      status: 500,
    });
  }
};

const addQuizToGame = async (req: Request, res: Response) => {
  try {
    if (!(await gameService.getGameById(req.params.id))) {
      return res.status(404).json({
        error: 'There is no game with that id',
        status: 404,
      });
    }

    const gameWithNewQuiz = await gameService.addQuizToGame(
      req.params.id,
      req.body
    );

    if (!gameWithNewQuiz) {
      throw new Error('Failed to add quize');
    }

    const gameDTO: IGame = {
      id: gameWithNewQuiz._id as unknown as string,
      code: gameWithNewQuiz.code,
      creatorId: gameWithNewQuiz.creatorId as unknown as string,
      players: gameWithNewQuiz.players as unknown as string[],
      maxPlayerLimit: gameWithNewQuiz.maxPlayerLimit,
      quizes: gameWithNewQuiz.quizes as unknown as IQuiz[],
    };

    return res.status(201).json(gameDTO);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Unable to add quiz to the game due to a server issue',
      status: 500,
    });
  }
};

export const gameController = {
  createNewGame,
  getAllGamesForUser,
  addQuizToGame,
};

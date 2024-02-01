import { Request, Response } from 'express';

import { gameService, userService, validationService } from '../services';
import { IGame, IQuiz, IUser } from '../types';

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
      error: 'Failed to create game due to a server issue',
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

    res.status(200).json({ games: gameDTOs });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Failed to fetch games due to a server issue',
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
      throw new Error('Failed to add quiz');
    }

    const gameDTO: IGame = {
      id: gameWithNewQuiz._id as unknown as string,
      code: gameWithNewQuiz.code,
      creatorId: gameWithNewQuiz.creatorId as unknown as string,
      players: gameWithNewQuiz.players as unknown as string[],
      maxPlayerLimit: gameWithNewQuiz.maxPlayerLimit,
      quizes: gameWithNewQuiz.quizes as unknown as IQuiz[],
    };

    return res.status(200).json(gameDTO);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      error: 'Failed to add quiz to the game due to a server issue',
      status: 500,
    });
  }
};

const getAllPlayersOfGame = async (req: Request, res: Response) => {
  try {
    const playerIds = await gameService.getAllPlayersWithGameId(
      req.params.id as string
    );

    let players: IUser[] = [];

    for (const id of playerIds) {
      const player = await userService.getUserById(id as unknown as string);

      if (!player) {
        continue;
      }

      const playerDTO: IUser = {
        id: player._id as unknown as string,
        username: player.username,
        type: player.type,
      };

      players.push(playerDTO);
    }

    res.status(200).json({ players });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to get players of the game due to a server issue',
      status: 500,
    });
  }
};

const updateGame = async (req: Request, res: Response) => {
  try {
    const updatedGame = await gameService.updateGame(req.params.id, req.body);

    if (!updatedGame) {
      throw new Error('Failed to update game');
    }

    const gameDTO: IGame = {
      id: updatedGame._id as unknown as string,
      code: updatedGame.code,
      creatorId: updatedGame.creatorId as unknown as string,
      players: updatedGame.players as unknown as string[],
      maxPlayerLimit: updatedGame.maxPlayerLimit,
      quizes: updatedGame.quizes as unknown as IQuiz[],
    };

    res.status(200).json(gameDTO);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update game due to a server issue',
      status: 500,
    });
  }
};

const deleteGame = async (req: Request, res: Response) => {
  try {
    const gameToDelete = await gameService.getGameById(req.params.id);

    if (!gameToDelete) {
      return res.status(404).json({
        error: 'Game not found',
        status: 404,
      });
    }

    for (const playerId of gameToDelete.players) {
      await userService.deleteUser(playerId as unknown as string);
    }

    await gameService.deleteGame(req.params.id);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update game due to a server issue',
      status: 500,
    });
  }
};

export const gameController = {
  createNewGame,
  getAllGamesForUser,
  getAllPlayersOfGame,
  addQuizToGame,
  updateGame,
  deleteGame,
};

import { gameModel } from '../models';
import { IGame, IQuiz } from '../types';

const createGame = async (gameData: IGame) => await gameModel.create(gameData);

const getGameById = async (id: string) => await gameModel.findById(id);

const getGameByCode = async (code: string) => await gameModel.findOne({ code });

const getAllGamesByCreatorId = async (creatorId: string) =>
  await gameModel.find({ creatorId });

const getAllPlayersWithGameId = async (id: string) => {
  const foundGame = await getGameById(id);

  if (!foundGame) return [];

  return foundGame.players;
};

const isGameCodeUnique = async (code: string) => {
  const foundGame = await getGameByCode(code);

  if (!foundGame) return true;

  return false;
};

const hasGameWithCodeReachedLimit = async (code: string) => {
  const foundGame = await getGameByCode(code);

  if (!foundGame) return false;

  return foundGame.players.length > foundGame.maxPlayerLimit;
};

const updateGame = async (id: string, updatedData: IGame) =>
  await gameModel.findByIdAndUpdate(id, updatedData, { new: true });

const addPlayerToGameWithCode = async (code: string, playerId: string) =>
  await gameModel.findOneAndUpdate(
    { code },
    { $push: { players: playerId } },
    { new: true }
  );

const addQuizToGame = async (id: string, quiz: IQuiz) =>
  await gameModel.findByIdAndUpdate(
    id,
    { $push: { quizes: quiz } },
    { new: true }
  );

const deleteGame = async (id: string) => await gameModel.findByIdAndDelete(id);

export const gameService = {
  createGame,
  getGameById,
  getGameByCode,
  getAllGamesByCreatorId,
  getAllPlayersWithGameId,
  isGameCodeUnique,
  hasGameWithCodeReachedLimit,
  updateGame,
  addPlayerToGameWithCode,
  addQuizToGame,
  deleteGame,
};

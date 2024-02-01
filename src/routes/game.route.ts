import { Router } from 'express';

import { gameController } from '../controllers';
import { middleware } from '../middleware';

const gameRouter = Router();

gameRouter.get('/', middleware.auth('creator'), gameController.getAllGamesForUser)
gameRouter.get('/:id/player', middleware.auth('creator'), gameController.getAllPlayersOfGame)

gameRouter.post('/', middleware.auth('creator'), gameController.createNewGame);
gameRouter.post('/:id/quiz', middleware.auth('creator'), gameController.addQuizToGame);
gameRouter.post('/:id/player', middleware.auth('player'), gameController.addPlayerToGameWithCode);


export { gameRouter };

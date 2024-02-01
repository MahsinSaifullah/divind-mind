import { Router } from 'express';

import { gameController } from '../controllers';
import { middleware } from '../middleware';

const gameRouter = Router();

gameRouter.get('/', middleware.auth('creator'), gameController.getAllGamesForUser)
gameRouter.post('/', middleware.auth('creator'), gameController.createNewGame);

export { gameRouter };

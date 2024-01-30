import { Router } from 'express';

import { gameController } from '../controllers';
import { middleware } from '../middleware';

const gameRouter = Router();

gameRouter.post('/', middleware.auth('creator'), gameController.createNewGame);

export { gameRouter };

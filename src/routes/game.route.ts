import { gameController } from 'controllers';
import { Router } from 'express';

const gameRouter = Router();

gameRouter.post('/', gameController.createNewGame);

export { gameRouter };

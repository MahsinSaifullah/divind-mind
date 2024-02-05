import { Router } from 'express';

import { gameController } from '../controllers';
import { middleware } from '../middleware';

const gameRouter = Router();

gameRouter.get('/', middleware.auth('creator'), gameController.getAllGamesForUser)
gameRouter.get('/:id/player', middleware.auth('creator'), gameController.getAllPlayersOfGame)
gameRouter.post('/', middleware.auth('creator'), gameController.createNewGame);
gameRouter.post('/:id/quiz', middleware.auth('creator'), gameController.addQuizToGame);
gameRouter.patch('/:id', middleware.auth('creator'), gameController.updateGame)
gameRouter.patch('/:id/quiz/:quizId', middleware.auth('creator'), gameController.updateQuiz);
gameRouter.delete('/:id', middleware.auth('creator'), gameController.deleteGame)


export { gameRouter };

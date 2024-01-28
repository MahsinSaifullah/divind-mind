import { Router } from 'express';
import { authController } from '../controllers';

const authRouter = Router();

authRouter.get('/register', authController.register);

export { authRouter };

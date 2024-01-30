import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { authRouter, gameRouter } from './routes';
import { environmentConfig } from './configs';

const app = express();
const PORT = environmentConfig.port || 5000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.use('/auth', authRouter);
app.use('/game', gameRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

mongoose.Promise = Promise;
mongoose
  .connect(environmentConfig.mongoUri as string)
  .then(() => console.log('Connected to database successfully...'));
mongoose.connection.on('error', (error: Error) => console.log(error));

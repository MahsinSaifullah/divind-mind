import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { authRouter, gameRouter } from './routes';
import { environmentConfig } from './configs';
import { websocketServer } from './websocket';

const app = express();
const PORT = environmentConfig.port || 5000;

//middlewares
app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/game', gameRouter);


const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

// init websocket
websocketServer(server)

mongoose.Promise = Promise;
mongoose
  .connect(environmentConfig.mongoUri as string)
  .then(() => console.log('Connected to database successfully...'));
mongoose.connection.on('error', (error: Error) => console.log(error));

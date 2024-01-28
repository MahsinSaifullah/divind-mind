import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { authRouter } from './routes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.use('/auth', authRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

mongoose.Promise = Promise;
mongoose
  .connect(process.env.MONGO_URL as string)
  .then(() => console.log('Connected to database successfully...'));
mongoose.connection.on('error', (error: Error) => console.log(error));

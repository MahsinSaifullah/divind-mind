import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: '*',
  })
);
app.use(express.json());

app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));

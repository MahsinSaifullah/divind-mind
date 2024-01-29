import * as dotenv from 'dotenv';

dotenv.config();

export const environmentConfig = {
    port:  process.env.PORT,
    mongoUri: process.env.MONGO_URL,
    jwtSecret: process.env.SECRET_KEY,
}

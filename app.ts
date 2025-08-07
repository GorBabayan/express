import express from 'express';
import dotenv from 'dotenv';
import UserRoutes from './routes/router.ts';
import { errorHandler }  from './middlewares/errorHandler';

const app = express();

dotenv.config();

app.use(express.json());
app.use('/users', UserRoutes);

app.use(errorHandler);

export default app;

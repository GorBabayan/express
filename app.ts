import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import UserRoutes from './routes/router';
import AuthRoutes from './routes/authRoutes'
import { errorHandler }  from './middlewares/errorHandler';
import cors from 'cors';

const app = express();

dotenv.config();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(cors({
    origin: 'https://e43d2c30c4f4.ngrok-free.app',
    credentials: true, 
}));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use('/auth', AuthRoutes);
app.use('/users', UserRoutes);

app.use(errorHandler);

export default app;

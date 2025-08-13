import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import UserRoutes from './routes/router';
import passport from './authentication/passport';
import authRoutes from './routes/authRoutes'
import { errorHandler }  from './middlewares/errorHandler';

const app = express();

dotenv.config();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/users', UserRoutes);
app.use('/auth', authRoutes);

app.use(errorHandler);

export default app;

import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { setupSwagger } from './swagger';
import UserRoutes from './routes/userRoutes';
import AuthRoutes from './routes/authRoutes'
import ProjectRoutes from './routes/projectRoutes';
import TaskRoutes from './routes/taskRoutes';
import { errorHandler }  from './middlewares/errorHandler';
import cors from 'cors';

const app = express();

dotenv.config();

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use(cors({
    origin: 'https://622703aa9d39.ngrok-free.app',
    credentials: true, 
}));

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use('/', AuthRoutes);
app.use('/projects', ProjectRoutes);
app.use('/tasks', TaskRoutes);
app.use('/users', UserRoutes);

setupSwagger(app);
app.use(errorHandler);

export default app;

import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/users';
import { Project } from '../entities/projects';
import { Task } from '../entities/tasks';
import { Comment } from '../entities/comments';

import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    synchronize: false,
    logging: false,
    entities: [User, Project, Task, Comment],
    migrations: ["migrations/*{.ts,.js}"],
})
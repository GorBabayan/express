import { Request, Response, NextFunction } from 'express';
import { LessThanOrEqual, MoreThanOrEqual, Between, IsNull } from 'typeorm';
import { Task } from '../entities/tasks';
import { User } from '../entities/users';
import { Project } from '../entities/projects';
import { AppDataSource } from '../db/data-source';
import { AppError } from '../errors/error';
import { CreateTaskBody, GetTasksQuery } from 'types/interfaces';

const taskRepo = AppDataSource.getRepository(Task);
const userRepo = AppDataSource.getRepository(User);
const projectRepo = AppDataSource.getRepository(Project);

/**
 * @throws { AppError } If project not found.
 * @throws { AppError } If assignee(user) not found.
 * @throws { Error } For unexpected database or runtime errors.
*/

export const createTask = async (req: Request<{}, {}, CreateTaskBody>, res: Response, next: NextFunction) => {
    try {
        const { title, projectId, assignedToId, status = "todo", dueDate } = req.body;

        const project: Project | null = await projectRepo.findOne({ where: { id: projectId } });
        if (!project) {
            throw new AppError("Project not found", 404);
        }

        const assignee = await userRepo.findOne({ where: { id: assignedToId } });
        if (!assignee) {
           throw new AppError("Assignee not found", 404); 
        }

        const task: Task  = taskRepo.create({ 
            title, 
            status,
            project, 
            assignedTo: assignee, 
            ...(dueDate && { dueDate }),
        });

        await taskRepo.save(task);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    } 
}

/**
@throws { Error } For unexpected database or runtime errors.
 */
export const getProjectTasks = async (req: Request<{}, {}, GetTasksQuery>, res: Response, next: NextFunction) => {
    try {
        const { projectId, status, dueBefore, dueAfter } = req.body;

        const where: Record<string, any> = { project: { id: projectId } };

        if (status) {
            where.status = status;
        }

         if (dueBefore || dueAfter) {
            if (dueBefore && dueAfter) {
                where.dueDate = Between(new Date(dueAfter), new Date(dueBefore));
            } else if (dueBefore) {
                where.dueDate = LessThanOrEqual(new Date(dueBefore));
            } else if (dueAfter) {
                where.dueDate = MoreThanOrEqual(new Date(dueAfter));
            }
        }

        const tasks: Task[] = await taskRepo.find({
            where,
            relations: ["assignedTo", "project"],
            order: {
                dueDate: "ASC",
                createdAt: "DESC"
            }
        });

        return res.json(tasks);
    } catch (err) {
        next(err);
    }
} 

/**
 * @throws { AppError } If task not found.
 * @throws { Error } For unexpected database or runtime errors.
 */

export const getTaskDetail = async (req: Request<{ taskId: string }, {}, {}>, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;

        const task: Task | null = await taskRepo.findOne({
            where: { id: taskId },
            relations: ["project", "assignedTo", "comments"],
        });

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        const commentCount: number = task.comments.length;

        res.json({ ...task, commentCount });
    } catch (err) {
        next(err);
    }
}


/**
 * @throws { AppError } If task not found.
 * @throws { AppError } If user not found.
 * @throws { Error } For unexpected database or runtime errors.
 */

export const reassignTask = async (req: Request<{ taskId: string }>, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        const { assignedToId } = req.body;

        const task: Task | null = await taskRepo.findOne({ where: { id: taskId } });
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        const user: User | null = await userRepo.findOne({ where: { id: assignedToId } });
        if (!user) {
            throw new AppError("User not found", 404);
        }

        task.assignedTo = user;
        await taskRepo.save(task);

        res.json(task);
    } catch (err) {
        next(err);
    }
};


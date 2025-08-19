import { Request, Response, NextFunction } from 'express';
import { LessThanOrEqual, MoreThanOrEqual, Between, IsNull } from 'typeorm';
import { Task } from '../entities/tasks';
import { User } from '../entities/users';
import { Project } from '../entities/projects';
import { AppDataSource } from '../db/data-source';
import { AppError } from '../errors/error';

interface CreateTaskBody {
  title: string;
  projectId: string;
  assignedToId?: string;
  status?: "todo" | "in_progress" | "done";
  dueDate?: string;
}

interface GetTasksQuery {
  projectId: string;
  status?: "todo" | "in_progress" | "done";
  dueBefore?: string;
  dueAfter?: string;
}

const taskRepo = AppDataSource.getRepository(Task);
const userRepo = AppDataSource.getRepository(User);
const projectRepo = AppDataSource.getRepository(Project);

export const createTask = async (req: Request<{}, {}, CreateTaskBody>, res: Response, next: NextFunction) => {
    try {
        const { title, projectId, assignedToId, status = "todo", dueDate } = req.body;

        const project = await projectRepo.findOne({ where: { id: projectId } });
        if (!project) {
            throw new AppError("Project not found", 404);
        }

        let assignee = null;
        assignee = await userRepo.findOne({ where: { id: assignedToId } });
        if (!assignee) {
           throw new AppError("Assignee not found", 404); 
        }

        const allowed = ["todo", "in_progress", "done"];
        if (!allowed.includes(status)) {
            throw new AppError("Invalid status", 400);
        }

        if (dueDate && new Date(dueDate) < new Date()) {
            console.warn("Due date is in the past");
        }

        const task = taskRepo.create({ title, status, project, assignedTo: assignee || null, ...(dueDate && { dueDate }),
        });

        await taskRepo.save(task);
        res.status(201).json(task);
    } catch (err) {
        next(err);
    } 
}

export const getProjectTasks = async (req: Request<{}, {}, GetTasksQuery>, res: Response, next: NextFunction) => {
    try {
        const { projectId, status, dueBefore, dueAfter } = req.body;

        const where: any = { project: { id: projectId } };

        if (status) {
            where.status = status;
        }

         if (dueBefore || dueAfter) {
            if (dueBefore && dueAfter) {
                where.dueDate = Between(new Date(dueAfter as string), new Date(dueBefore as string));
            } else if (dueBefore) {
                where.dueDate = LessThanOrEqual(new Date(dueBefore as string));
            } else if (dueAfter) {
                where.dueDate = MoreThanOrEqual(new Date(dueAfter as string));
            }
        }

        const tasks = await taskRepo.find({
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

export const getTaskDetail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;

        const task = await taskRepo.findOne({
            where: { id: taskId },
            relations: ["project", "assignedTo", "comments"],
        });

        if (!task) {
            throw new AppError("Task not found", 404);
        }

        const commentCount = task.comments.length;

        res.json({ ...task, commentCount });
    } catch (err) {
        next(err);
    }
}

export const reassignTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { taskId } = req.params;
        const { assignedToId } = req.body;

        const taskRepo = AppDataSource.getRepository(Task);
        const userRepo = AppDataSource.getRepository(User);

        const task = await taskRepo.findOne({ where: { id: taskId } });
        if (!task) {
            throw new AppError("Task not found", 404);
        }

        const user = await userRepo.findOne({ where: { id: assignedToId } });
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


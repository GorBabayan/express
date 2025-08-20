import { Request, Response, NextFunction } from "express";
import { ILike } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Project } from "../entities/projects";
import { User } from "../entities/users";
import { AppError } from "../errors/error";
import { CreateProjectBody, ListProjectsQuery } from "types/interfaces";

const projectRepo = AppDataSource.getRepository(Project);

export const createProject = async (req: Request<{}, {}, CreateProjectBody>, res: Response<{ project: Project }>, next: NextFunction) => {
    try {
        const { name, description, ownerId } = req.body;

        const owner: User | null = await AppDataSource.getRepository(User).findOneBy({ id: ownerId });
        if (!owner) {
            throw new AppError("Owner not found", 404);
        }

        const project = projectRepo.create({ name, description, owner });
        await projectRepo.save(project);
        

        res.status(201).json({ project });
    } catch(err) {
        next(err);
    }
}

export const listProjects = async (req: Request<{}, {}, ListProjectsQuery>, res: Response, next: NextFunction) => {
    try {
        const { q, page = 1, limit = 10 } = req.query;
        const pageNum: number = Math.max(1, Number(page));
        const limitNum: number = Math.max(1, Number(limit));
        const skip: number = (pageNum - 1) * limitNum;

        const where = q
        ? [
            { name:  ILike(`%${q}%`) },
            { description: ILike(`%${q}%`) }
          ]
        : undefined;

        const [projects, total]: [Project[], number] = await projectRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip,
            take: limitNum,
        });

        res.json({
            data: projects,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
        });
    } catch (err) {
        next(err);
    }
}


import { Request, Response, NextFunction } from "express";
import { ILike } from "typeorm";
import { AppDataSource } from "../db/data-source";
import { Project } from "../entities/projects";
import { User } from "../entities/users";
import { AppError } from "../errors/error";

const projectRepo = AppDataSource.getRepository(Project);

export const createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, ownerId } = req.body;

        if (!ownerId) {
            throw new AppError("ownerId is required", 400);
        }

        const owner = await AppDataSource.getRepository(User).findOneBy({ id: ownerId });
        if (!owner) {
            throw new AppError("Owner not found", 404);
        }

        const exists = await projectRepo.findOne({ where: { name }});

        if (exists) {
            throw new AppError("Project name already exists", 400);
        }

        const project = projectRepo.create({ name, description, owner });
        await projectRepo.save(project);

        res.status(201).json({ project });
    } catch(err) {
        next(err);
    }
}

export const listProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q, page="1", limit="10" } = req.query;
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const where = q
        ? [
            { name:  ILike(`%${q}%`) },
            { description: ILike(`%${q}%`) }
          ]
        : {};

        const [projects, total] = await projectRepo.findAndCount({
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


import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as UserModel from '../models/model.ts';
import { BadRequestError, ConflictError } from 'errors/error.ts';

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserModel.findUserByIdOrEmail(req.params.id_or_email);

        res.json(user);
    } catch (err) {
        next(err);
    }
}

export const postUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newUser = await UserModel.createUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        next(err);
    }

}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedUser = await UserModel.deleteUser(req.params.id);

        res.json({ message: "User Deleted", user: deletedUser });
    } catch (err) {
        next(err);
    }
}

export const putUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await UserModel.updateUser(req.params.id, req.body);

        res.json(updatedUser);
    } catch (err) {
       next(err);
    }
}

export const patchUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updatedUser = await UserModel.patchUser(req.params.id, req.body);

        res.json(updatedUser);
    } catch(err) {
       next(err);
    }
}
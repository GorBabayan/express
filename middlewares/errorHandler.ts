import { Request, Response, NextFunction } from 'express';
import { AppError } from "../errors/error";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        })
    }

    if (err.code == '23505') {
        return res.status(409).json({
            status: 'error',
            message: err.message,
            detail: err.detail || ''
        });
    }

    console.error("Unhandled error", err);
    res.status(500).json({
        status: 'error',
        message: err.message
    });
}
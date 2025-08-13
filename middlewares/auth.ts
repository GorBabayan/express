import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../errors/error';

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.isAuthenticated()) {
      return next();
    }

   throw new UnauthorizedError("User unauthorized");
  } catch (err) {
    next(err);
  }
}
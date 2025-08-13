import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import passport from '../authentication/passport';
import { AppDataSource } from '../db/data-source';
import { User } from '../types/types';
import { ensureAuthenticated } from '../middlewares/auth';

const router = Router();

router.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
  res.send("Logged in successfull");
});

router.get('/logout', (req: Request, res: Response) => {
  req.logout(() => {
    res.send("Logged out successfull");
  });
});

export default router;
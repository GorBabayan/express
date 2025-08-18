import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { AppDataSource } from '../db/data-source';
import { User } from '../types/types';
import dotenv from 'dotenv';
import { authenticateJWT, AuthRequest } from '../middlewares/auth';

dotenv.config();
const router = Router();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
const secret: Secret = process.env.JWT_SECRET || "default_secret";
const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
const options: SignOptions = { expiresIn: expiresIn as any };


router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password requires" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, options);

    return res.json({ token });
});

router.get('/profile', authenticateJWT, async (req: AuthRequest, res: Response) => {
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: req.user.id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password, ...safeUser } = user;
  
  return res.json({ user: safeUser });
})

export default router;
import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { LoginUserBody, JwtPayloadType, AuthRequest } from '../types/interfaces';
import { AppDataSource } from '../db/data-source';
import { User } from '../entities/users';
import dotenv from 'dotenv';
import { authenticateJWT } from '../middlewares/auth';

dotenv.config();
const router = Router();

if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET missing");
const secret: Secret = process.env.JWT_SECRET || "default_secret";
const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
const options: SignOptions = { expiresIn: expiresIn as any };

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user and receive a JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing email or password
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', async (req: Request<{}, {}, LoginUserBody>, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password requires" });
    }

    const userRepo = AppDataSource.getRepository(User);
    try {
        const user = await userRepo.findOneBy({ email });

        if (!user) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValid = await user.validatePassword(password);
        if (!isValid) {
          return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secret, options);

        return res.json({ token });
    } catch(err) {
      next(err);
    }
});

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get the authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (invalid/missing token)
 *       404:
 *         description: User not found
 */
router.get('/me', authenticateJWT, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: authReq.user.id });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const { password, ...safeUser } = user;
  
  return res.json({ user: safeUser });
})

export default router;
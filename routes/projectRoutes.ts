import { Router } from 'express';
import { createProject, listProjects } from '../controllers/projectController';
import { authenticateJWT } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createProjectSchema, listProjectsSchema } from '../validators/ProjectSchema';


const router = Router();

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticateJWT, validate(createProjectSchema), createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticateJWT, validate(listProjectsSchema), listProjects);



export default router;
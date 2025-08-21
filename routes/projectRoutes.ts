import { Router } from 'express';
import { createProject, listProjects } from '../controllers/projectController';
import { authenticateJWT } from '../middlewares/auth';
import { validate } from '../middlewares/validation';
import { createProjectSchema, listProjectsSchema } from '../validators/ProjectSchema';


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Project redesign"
 *               description:
 *                 type: string
 *                 example: "We need to update in our project design."
 *     responses:
 *       201:
 *         description: Project created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Project redesign"
 *                 description:
 *                   type: string
 *                   example: "We need to update in our project design."
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-21T12:00:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation failed"
 *               errors:
 *                 - field: "name"
 *                   message: "Name is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 */
router.post("/", authenticateJWT, validate(createProjectSchema), createProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: List all projects
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Project redesign"
 *                   description:
 *                     type: string
 *                     example: "We need to update in our project design."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-08-21T12:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-08-21T12:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 */
router.get("/", authenticateJWT, validate(listProjectsSchema), listProjects);



export default router;
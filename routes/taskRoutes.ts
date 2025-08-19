import Router from 'express';
import { createTask, getProjectTasks, getTaskDetail, reassignTask } from '../controllers/taskController';

const router = Router();

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               projectId:
 *                 type: string
 *               assignedToId:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *               dueDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Task created successfully
 */
router.post('/', createTask); 

/**
 * @swagger
 * /tasks/project/{projectId}:
 *   get:
 *     summary: Get all tasks for a project
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of tasks for the project
 */
router.get('/project/:projectId', getProjectTasks);

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get task details
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task details
 */
router.get('/:taskId', getTaskDetail);

/**
 * @swagger
 * /tasks/{taskId}/reassign:
 *   put:
 *     summary: Reassign a task to another user
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignedToId:
 *                 type: string
 *                 description: New user ID to assign the task
 *     responses:
 *       200:
 *         description: Task reassigned successfully
 *       404:
 *         description: Task not found
 */
router.put('/:taskId/reassign', reassignTask);

export default router;
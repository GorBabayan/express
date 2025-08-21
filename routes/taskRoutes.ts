import Router from 'express';
import { createTask, getProjectTasks, getTaskDetail, reassignTask } from '../controllers/taskController';
import { validate } from '../middlewares/validation';
import { 
    createTaskSchema, 
    getProjectTasksSchema, 
    getTaskDetailSchema, 
    taskReassignSchema 
} from '../validators/TaskSchema';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Finish Project redesign"
 *               projectId:
 *                 type: integer
 *                 example: 1
 *               assignedToId:
 *                 type: integer
 *                 example: 5
 *               status:
 *                 type: string
 *                 enum: [todo, in_progress, done]
 *                 example: "todo"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-09-01"
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 101
 *                 title:
 *                   type: string
 *                   example: "Finish Project redesign"
 *                 projectId:
 *                   type: integer
 *                   example: 1
 *                 assignedToId:
 *                   type: integer
 *                   example: 5
 *                 status:
 *                   type: string
 *                   example: "todo"
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   example: "2025-09-01"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-21T12:00:00Z"
 *                 updatedAt:
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
 *                 - field: "title"
 *                   message: "Title is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Project with ID 1 not found"
 */
router.post('/', validate(createTaskSchema), createTask); 

/**
 * @swagger
 * /tasks/project/{projectId}:
 *   get:
 *     summary: Get all tasks for a project
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the project
 *         example: 1
 *     responses:
 *       200:
 *         description: List of tasks for the project
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 101
 *                   title:
 *                     type: string
 *                     example: "Finish project redesign"
 *                   projectId:
 *                     type: integer
 *                     example: 1
 *                   assignedToId:
 *                     type: integer
 *                     example: 5
 *                   status:
 *                     type: string
 *                     enum: [todo, in_progress, done]
 *                     example: "in_progress"
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     example: "2025-09-05"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-08-21T12:00:00Z"
 *                   updatedAt:
    *                   type: string
    *                   format: date-time
    *                   example: "2025-08-21T12:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *       404:
 *         description: Project not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Project with id 1 not found"
 */
router.get('/project/:projectId', validate(getProjectTasksSchema), getProjectTasks);

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get task details
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: id of the task
 *         example: 42
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 42
 *                 title:
 *                   type: string
 *                   example: "Project redesign"
 *                 projectId:
 *                   type: integer
 *                   example: 3
 *                 assignedToId:
 *                   type: integer
 *                   example: 7
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                   example: "done"
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   example: "2025-09-10"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-21T14:30:00Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-21T15:00:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Task with id 42 not found"
 */
router.get('/:taskId', validate(getTaskDetailSchema), getTaskDetail);

/**
 * @swagger
 * /tasks/{taskId}/reassign:
 *   put:
 *     summary: Reassign a task to another user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: integer
 *         description: id of the task to reassign
 *         example: 42
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedToId
 *             properties:
 *               assignedToId:
 *                 type: integer
 *                 description: New user id to assign the task
 *                 example: 7
 *     responses:
 *       200:
 *         description: Task reassigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: "Project redesign"
 *                 assignedToId:
 *                   type: integer
 *                   example: 7
 *                 status:
 *                   type: string
 *                   enum: [todo, in_progress, done]
 *                   example: "in_progress"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-21T16:00:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation failed"
 *               errors:
 *                 - field: "assignedToId"
 *                   message: "assignedToId is required"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Unauthorized"
 *       404:
 *         description: Task not found
 *         content:
 *           application/json:
 *             example:
 *               message: "Task with id 1 not found"
 */
router.put('/:taskId/reassign', validate(taskReassignSchema), reassignTask);

export default router;
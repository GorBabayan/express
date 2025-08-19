import express from 'express';
import * as UserController from '../controllers/userController';
import { validate } from '../middlewares/validation';
import { usersPostSchema, usersUpdateSchema } from '../validators/schema';

const router = express.Router();

/**
 * @swagger
 * /users/{id_or_email}:
 *   get:
 *     summary: Get a user by ID or email
 *     parameters:
 *       - in: path
 *         name: id_or_email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id_or_email', validate(usersUpdateSchema), UserController.getUsers);


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/', validate(usersPostSchema), UserController.postUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 */
router.delete('/:id', UserController.deleteUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user fully
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.put('/:id', validate(usersPostSchema), UserController.putUser);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update a user partially
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 */
router.patch('/:id', validate(usersUpdateSchema), UserController.patchUser);

export default router; 
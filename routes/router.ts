import express from 'express';
import * as UserController from '../controllers/controller';
import { validate } from '../middlewares/validation';
import { usersPostSchema, usersUpdateSchema } from '../validators/schema';

const router = express.Router();
//use router
router.get('/:id_or_email', validate(usersUpdateSchema), UserController.getUsers);
router.post('/', validate(usersPostSchema), UserController.postUser);
router.delete('/:id', UserController.deleteUser);
router.put('/:id', validate(usersPostSchema), UserController.putUser);
router.patch('/:id', validate(usersUpdateSchema), UserController.patchUser);

export default router;
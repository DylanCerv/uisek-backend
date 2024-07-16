import { Router } from 'express';

import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { UserController } from '../controllers/user.controller.js';

export const routerUser = Router();

routerUser.post('/', [
    verifyTokenMiddleware,
], UserController.createUser);

routerUser.get('/', [
    verifyTokenMiddleware,
], UserController.getAllUsers);

routerUser.get('/:id', [
    verifyTokenMiddleware,
], UserController.getUserById);

routerUser.put('/:id', [
    verifyTokenMiddleware,
], UserController.updateUser);

routerUser.delete('/:id', [
    verifyTokenMiddleware,
], UserController.deleteUser);

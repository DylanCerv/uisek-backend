import { Router } from 'express';

import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { CategoryExpenseController } from '../controllers/categoryExpense.controller.js';

export const routerCategory = Router();

routerCategory.post('/', [
    verifyTokenMiddleware,
], CategoryExpenseController.createCategory);

routerCategory.get('/', [
    verifyTokenMiddleware,
], CategoryExpenseController.getAllCategories);

routerCategory.get('/:id', [
    verifyTokenMiddleware,
], CategoryExpenseController.getCategoryById);

routerCategory.put('/:id', [
    verifyTokenMiddleware,
], CategoryExpenseController.updateCategory);

routerCategory.delete('/:id', [
    verifyTokenMiddleware,
], CategoryExpenseController.deleteCategory);
import { Router } from 'express';

import { verifyTokenMiddleware } from '../middlewares/verifyToken.middleware.js';
import { ExpenseController } from '../controllers/expense.controller.js';

export const routerExpense = Router();

routerExpense.post('/', [
    verifyTokenMiddleware,
], ExpenseController.createExpense);

routerExpense.get('/', [
    verifyTokenMiddleware,
], ExpenseController.getAllExpenses);

routerExpense.get('/category/:categoryId', [
    verifyTokenMiddleware,
], ExpenseController.getExpensesByCategory);

routerExpense.get('/filter', [
    verifyTokenMiddleware,
], ExpenseController.filterAndSortExpenses);

routerExpense.get('/total', [
    verifyTokenMiddleware,
], ExpenseController.getTotalExpenses);

routerExpense.put('/:id', [
    verifyTokenMiddleware,
], ExpenseController.updateExpense);

routerExpense.delete('/:id', [
    verifyTokenMiddleware,
], ExpenseController.deleteExpense);
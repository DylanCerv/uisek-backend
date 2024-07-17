import { Op } from "sequelize";
import { Category } from "../models/category.js";
import { Expense } from "../models/expense.js";
import { sendResponse } from "../helpers/utils.js";

export class ExpenseController {

    /**
     * Create a new expense
     */
    // POST expenses/
    static async createExpense(req, res) {
        try {
            const { description, amount, date, categoryId } = req.body;

            // // Validar la presencia de los campos requeridos
            // if (!description || !amount || !date || !categoryId ) {
            //     return sendResponse(res, 400, true, 'Todos los campos son obligatorios.');
            // }

            // Crear un nuevo gasto
            const newExpense = await Expense.create({ description, amount, date, categoryId });
            return sendResponse(res, 201, false, 'Gasto creado exitosamente.', null, { expense: newExpense });
        } catch (error) {
            console.error('Error al crear gasto:', error);
            return sendResponse(res, 500, true, 'Error al crear gasto.');
        }
    }

    /**
     * Get all expenses
     */
    // GET expenses/
    static async getAllExpenses(req, res) {
        try {

            const { category, sortBy, order } = req.query;
            let where = {};
            let orderBy = [];

            // Check if categoryId is provided (from path or query)
            if (req.params.categoryId || category) {
                where.categoryId = req.params.categoryId || category;
            }

            if (sortBy && order) {
                orderBy.push([sortBy, order]);
            }

            const expenses = await Expense.findAll({ where, order: orderBy, include: Category });

            return sendResponse(res, 200, false, 'Gastos obtenidos exitosamente.', null, { expenses });
        } catch (error) {
            console.error('Error al obtener gastos:', error);
            return sendResponse(res, 500, true, 'Error al obtener gastos.');
        }
    }

    /**
     * Get expenses by category
     */
    // GET expenses/category/:categoryId
    static async getExpensesByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const expenses = await Expense.findAll({ where: { categoryId }, include: Category });
            return sendResponse(res, 200, false, 'Gastos obtenidos exitosamente.', null, { expenses });
        } catch (error) {
            console.error('Error al obtener gastos por categoría:', error);
            return sendResponse(res, 500, true, 'Error al obtener gastos por categoría.');
        }
    }

    /**
     * Filter and sort expenses
     */
    // GET expenses/filter
    static async filterAndSortExpenses(req, res) {
        try {
            const { category, startDate, endDate, sortBy, order } = req.query;
            let where = {};
            let orderBy = [];

            if (category) {
                where.categoryId = category;
            }
            if (startDate && endDate) {
                where.date = { [Op.between]: [startDate, endDate] };
            }

            if (sortBy && order) {
                orderBy.push([sortBy, order]);
            }

            const expenses = await Expense.findAll({ where, order: orderBy, include: Category });
            return sendResponse(res, 200, false, 'Gastos filtrados y ordenados exitosamente.', null, { expenses });
        } catch (error) {
            console.error('Error al filtrar y ordenar gastos:', error);
            return sendResponse(res, 500, true, 'Error al filtrar y ordenar gastos.');
        }
    }

    /**
     * Get total expenses by category and month
     */
    // GET expenses/total
    static async getTotalExpenses(req, res) {
        try {
            const { category, month } = req.query;
            let where = {};

            if (category) {
                where.categoryId = category;
            }
            if (month) {
                const startDate = new Date(month);
                const endDate = new Date(month);
                endDate.setMonth(endDate.getMonth() + 1);
                where.date = { [Op.between]: [startDate, endDate] };
            }

            const total = await Expense.sum('amount', { where });
            return sendResponse(res, 200, false, 'Total de gastos obtenido exitosamente.', null, { total });
        } catch (error) {
            console.error('Error al obtener total de gastos:', error);
            return sendResponse(res, 500, true, 'Error al obtener total de gastos.');
        }
    }

    /**
     * Update an expense
     */
    // PUT expenses/:id
    static async updateExpense(req, res) {
        try {
            const { id } = req.params;
            const { description, amount, date, categoryId } = req.body;

            // Verificar si el gasto existe
            const expense = await Expense.findByPk(id);
            if (!expense) {
                return sendResponse(res, 404, true, 'Gasto no encontrado.');
            }

            // Actualizar el gasto
            expense.description = description || expense.description;
            expense.amount = amount || expense.amount;
            expense.date = date || expense.date;
            expense.categoryId = categoryId || expense.categoryId;
            await expense.save();

            return sendResponse(res, 200, false, 'Gasto actualizado exitosamente.', null, { expense });
        } catch (error) {
            console.error('Error al actualizar gasto:', error);
            return sendResponse(res, 500, true, 'Error al actualizar gasto.');
        }
    }

    /**
     * Delete an expense
     */
    // DELETE expenses/:id
    static async deleteExpense(req, res) {
        try {
            const { id } = req.params;

            // Verificar si el gasto existe
            const expense = await Expense.findByPk(id);
            if (!expense) {
                return sendResponse(res, 404, true, 'Gasto no encontrado.');
            }

            // Eliminar el gasto
            await expense.destroy();

            return sendResponse(res, 200, false, 'Gasto eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar gasto:', error);
            return sendResponse(res, 500, true, 'Error al eliminar gasto.');
        }
    }
}

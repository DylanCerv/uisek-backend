import { sendResponse } from "../helpers/utils.js";
import { Category } from "../models/category.js";

export class CategoryExpenseController {

    /**
     * Create a new category
     */
    // POST categories/
    static async createCategory(req, res) {
        try {
            const { name } = req.body;

            // Validar la presencia de los campos requeridos
            if (!name) {
                return sendResponse(res, 400, true, 'El nombre de la categoría es obligatorio.');
            }

            // Verificar si la categoría ya existe
            const existingCategory = await Category.findOne({ where: { name } });
            if (existingCategory) {
                return sendResponse(res, 400, true, 'La categoría ya existe.');
            }

            // Crear una nueva categoría
            const newCategory = await Category.create({ name });
            return sendResponse(res, 201, false, 'Categoría creada exitosamente.', null, { category: newCategory });
        } catch (error) {
            console.error('Error al crear categoría:', error);
            return sendResponse(res, 500, true, 'Error al crear categoría.');
        }
    }

    /**
     * Get all categories
     */
    // GET categories/
    static async getAllCategories(req, res) {
        try {
            const categories = await Category.findAll();
            return sendResponse(res, 200, false, 'Categorías obtenidas exitosamente.', null, { categories });
        } catch (error) {
            console.error('Error al obtener categorías:', error);
            return sendResponse(res, 500, true, 'Error al obtener categorías.');
        }
    }

    /**
     * Get a category by ID
     */
    // GET categories/:id
    static async getCategoryById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) {
                return sendResponse(res, 404, true, 'Categoría no encontrada.');
            }
            return sendResponse(res, 200, false, 'Categoría obtenida exitosamente.', null, { category });
        } catch (error) {
            console.error('Error al obtener categoría:', error);
            return sendResponse(res, 500, true, 'Error al obtener categoría.');
        }
    }

    /**
     * Update a category
     */
    // PUT categories/:id
    static async updateCategory(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const category = await Category.findByPk(id);
            if (!category) {
                return sendResponse(res, 404, true, 'Categoría no encontrada.');
            }

            // Actualizar la categoría
            category.name = name || category.name;
            await category.save();

            return sendResponse(res, 200, false, 'Categoría actualizada exitosamente.', null, { category });
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            return sendResponse(res, 500, true, 'Error al actualizar categoría.');
        }
    }

    /**
     * Delete a category
     */
    // DELETE categories/:id
    static async deleteCategory(req, res) {
        try {
            const { id } = req.params;

            const category = await Category.findByPk(id);
            if (!category) {
                return sendResponse(res, 404, true, 'Categoría no encontrada.');
            }

            await category.destroy();
            return sendResponse(res, 200, false, 'Categoría eliminada exitosamente.');
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            return sendResponse(res, 500, true, 'Error al eliminar categoría.');
        }
    }
}

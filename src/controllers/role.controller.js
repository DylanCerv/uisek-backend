import { Role } from '../models/role.js';
import { sendResponse } from '../helpers/utils.js';

export class RoleController {

    /**
     * Create a new role
     */
    // POST roles/
    static async createRole(req, res) {
        try {
            const { name, description } = req.body;

            // Validar la presencia de los campos requeridos
            if (!name) {
                return sendResponse(res, 400, true, 'El nombre del rol es obligatorio.');
            }

            // Verificar si el rol ya existe
            const existingRole = await Role.findOne({ where: { name } });
            if (existingRole) {
                return sendResponse(res, 400, true, 'El rol ya existe.');
            }

            // Crear un nuevo rol
            const newRole = await Role.create({ name, description });
            return sendResponse(res, 201, false, 'Rol creado exitosamente.', null, { role: newRole });
        } catch (error) {
            console.error('Error al crear rol:', error);
            return sendResponse(res, 500, true, 'Error al crear rol.');
        }
    }

    /**
     * Get all roles
     */
    // GET roles/
    static async getAllRoles(req, res) {
        try {
            const roles = await Role.findAll();
            return sendResponse(res, 200, false, 'Roles obtenidos exitosamente.', null, { roles });
        } catch (error) {
            console.error('Error al obtener roles:', error);
            return sendResponse(res, 500, true, 'Error al obtener roles.');
        }
    }

    /**
     * Get a role by ID
     */
    // GET roles/:id
    static async getRoleById(req, res) {
        try {
            const { id } = req.params;
            const role = await Role.findByPk(id);
            if (!role) {
                return sendResponse(res, 404, true, 'Rol no encontrado.');
            }
            return sendResponse(res, 200, false, 'Rol obtenido exitosamente.', null, { role });
        } catch (error) {
            console.error('Error al obtener rol:', error);
            return sendResponse(res, 500, true, 'Error al obtener rol.');
        }
    }

    /**
     * Update a role
     */
    // PUT roles/:id
    static async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const role = await Role.findByPk(id);
            if (!role) {
                return sendResponse(res, 404, true, 'Rol no encontrado.');
            }

            // Actualizar el rol
            role.name = name || role.name;
            role.description = description || role.description;
            await role.save();

            return sendResponse(res, 200, false, 'Rol actualizado exitosamente.', null, { role });
        } catch (error) {
            console.error('Error al actualizar rol:', error);
            return sendResponse(res, 500, true, 'Error al actualizar rol.');
        }
    }

    /**
     * Delete a role
     */
    // DELETE roles/:id
    static async deleteRole(req, res) {
        try {
            const { id } = req.params;

            const role = await Role.findByPk(id);
            if (!role) {
                return sendResponse(res, 404, true, 'Rol no encontrado.');
            }

            await role.destroy();
            return sendResponse(res, 200, false, 'Rol eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            return sendResponse(res, 500, true, 'Error al eliminar rol.');
        }
    }
}

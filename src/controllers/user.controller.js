import { User } from '../models/users.js';
import { Role } from '../models/role.js';
import { sendResponse } from '../helpers/utils.js';
import bcrypt from 'bcrypt';


export class UserController {

    /**
     * Create a new user
     */
    // POST users/
    static async createUser(req, res) {
        try {
            const { email, password, lastname, name, roleId } = req.body;

            // Validar la presencia de los campos requeridos
            if (!email || !password || !lastname || !roleId || !name) {
                return sendResponse(res, 400, true, 'Todos los campos son obligatorios.');
            }

            // Verificar si el correo ya está en uso
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return sendResponse(res, 400, true, 'Correo electrónico ya está en uso.');
            }

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ email, password: hashedPassword, lastname, name, roleId });

            return sendResponse(res, 201, false, 'Usuario creado exitosamente.', null, { user: newUser });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            return sendResponse(res, 500, true, 'Error al crear usuario.');
        }
    }

    /**
     * Get all users
     */
    // GET users/
    static async getAllUsers(req, res) {
        try {
            const users = await User.findAll({ include: Role });
            return sendResponse(res, 200, false, 'Usuarios obtenidos exitosamente.', null, { users });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return sendResponse(res, 500, true, 'Error al obtener usuarios.');
        }
    }

    /**
     * Get a user by ID
     */
    // GET users/:id
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id, { include: Role });
            if (!user) {
                return sendResponse(res, 404, true, 'Usuario no encontrado.');
            }
            return sendResponse(res, 200, false, 'Usuario obtenido exitosamente.', null, { user });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return sendResponse(res, 500, true, 'Error al obtener usuario.');
        }
    }

    /**
     * Update a user
     */
    // PUT users/:id
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { email, password, name, lastname, roleId } = req.body;

            const user = await User.findByPk(id);
            if (!user) {
                return sendResponse(res, 404, true, 'Usuario no encontrado.');
            }


            // Actualizar el usuario
            if (email) {
                const existingUser = await User.findOne({ where: { email } });
                if (existingUser) {
                    return sendResponse(res, 400, true, 'Correo electrónico ya está en uso.');
                }
                user.email = email;
            }
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                user.password = hashedPassword;
            }
            user.name = name || user.name;
            user.lastname = lastname || user.lastname;
            user.roleId = roleId || user.roleId;
            await user.save();


            return sendResponse(res, 200, false, 'Usuario actualizado exitosamente.', null, { user });
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            return sendResponse(res, 500, true, 'Error al actualizar usuario.');
        }
    }

    /**
     * Delete a user
     */
    // DELETE users/:id
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;

            const user = await User.findByPk(id);
            if (!user) {
                return sendResponse(res, 404, true, 'Usuario no encontrado.');
            }

            await user.destroy();
            return sendResponse(res, 200, false, 'Usuario eliminado exitosamente.');
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            return sendResponse(res, 500, true, 'Error al eliminar usuario.');
        }
    }
}

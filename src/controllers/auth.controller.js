import bcrypt from 'bcrypt';
import {
    sendResponse,
    validateEmailFormat,
    validateRequiredFields
} from "../helpers/utils.js";
import {
    signJWT
} from "../helpers/jwt.helper.js"

import {
    User
} from "../models/users.js";
import { body, validationResult } from 'express-validator';


export class AuthController {


    /**
     * Register a user
     */
    // POST auth/register
    static async register(req, res) {

        // Validaciones utilizando express-validator
        await body('email').isEmail().normalizeEmail().run(req);
        await body('password').isLength({ min: 6 }).run(req);
        await body('name').notEmpty().run(req);
        await body('lastname').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }

        try {
            const {
                email,
                password,
                name,
                lastname,
                roleId
            } = req.body;

            // Verificar si el nombre de usuario ya existe
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return sendResponse(res, 400, true, 'Correo electrónico ya está en uso');
            }

            // Crear un nuevo usuario
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                email,
                password: hashedPassword,
                name,
                lastname,
                roleId,
            });

            // Generar token de autenticación
            const token = signJWT({
                userId: newUser.id
            });

            return sendResponse(res, 201, false, 'Registrado', null, {
                token: token
            });
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return sendResponse(res, 500, true, 'Error al registrar usuario');
        }
    }

    /**
     * Login a user
     */
    // POST auth/login
    static async login(req, res) {
        // Validaciones utilizando express-validator
        await body('email').isEmail().normalizeEmail().run(req);
        await body('password').notEmpty().run(req);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendResponse(res, 400, true, 'Errores de validación', errors.array());
        }


        try {
            const {
                email,
                password
            } = req.body;

            // Verificar si el usuario existe
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return sendResponse(res, 401, true, 'Credenciales no válidas');
            }

            // Verificar la contraseña
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return sendResponse(res, 401, true, 'Credenciales no válidas');
            }

            // Generar token de autenticación
            const token = signJWT({
                userId: user.id
            });

            return sendResponse(res, 201, false, 'Acceso exitoso', null, {
                token: token
            });
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            res.status(500).json({
                error: 'Error al iniciar sesión'
            });
        }
    }

}
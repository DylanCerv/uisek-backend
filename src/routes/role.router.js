import { Router } from 'express';

import { RoleController } from '../controllers/role.controller.js';


export const routerRole = Router();

routerRole.post('/', RoleController.createRole);

routerRole.get('/', RoleController.getAllRoles);

routerRole.get('/:id', RoleController.getRoleById);

routerRole.put('/:id', RoleController.updateRole);

routerRole.delete('/:id', RoleController.deleteRole);



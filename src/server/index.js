import express from 'express';
import cors from 'cors';
import { sequelize } from '../config/database.config.js';

// Helpers
import { sendResponse } from '../helpers/utils.js';

// Models
import '../models/role.js'
import '../models/users.js'
import '../models/category.js'
import '../models/expense.js'

// Routes
import { routerAuth } from '../routes/auth.router.js';
import { routerRole } from '../routes/role.router.js';
import { routerUser } from '../routes/user.router.js';
import { routerCategory } from '../routes/category.router.js';
import { routerExpense } from '../routes/expense.router.js';


class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;

    // DB
    this.connectionDB();

    // Middlewares
    this.middlewares();

    // Rutas de la app
    this.routes();
  }

  routes() {
    // Rutas para el uso de app
    this.app.use('/auth', routerAuth);
    this.app.use('/roles', routerRole);
    this.app.use('/users', routerUser);
    this.app.use('/categories', routerCategory);
    this.app.use('/expenses', routerExpense);


    // Error 404
    this.app.use('*', (req, res) => {
      sendResponse(res, 400, true, 'Endpoint no encontrado');
    });

  }

  connectionDB() {
    // sequelize.sync({ alter: true });
    sequelize.sync();
  }

  middlewares() {
    // CORS
    this.app.use(
      cors()
    );

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio público
    this.app.use(express.static('public'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor corriendo en http://localhost:${this.port}`);
    });
  }

}

export default Server;

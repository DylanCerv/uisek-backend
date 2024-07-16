import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { Category } from "./category.js";


export const Expense = sequelize.define('Expense', {
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // categoryId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: 'Categories',
  //     key: 'id'
  //   }
  // },
  // userId: {
  //   type: DataTypes.INTEGER,
  //   references: {
  //     model: 'Users',
  //     key: 'id'
  //   }
  // },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  timestamps: true
});


// Definir la relación con Role
Expense.belongsTo(Category, { foreignKey: 'categoryId' }); // Ajusta 'roleId' según tu campo de clave externa

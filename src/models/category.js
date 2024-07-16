import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";

export const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
}, {
    timestamps: false
});

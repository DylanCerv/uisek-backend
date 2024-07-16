import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";
import { Role } from "./role.js";
import bcrypt from 'bcrypt';


export const User = sequelize.define('users', {
    name: {
      type: DataTypes.STRING,
    //   allowNull: false,
    },
    lastname: {
      type: DataTypes.STRING,
    //   allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
}, {
    timestamps: true
});

// Definir la relación con Role
User.belongsTo(Role, { foreignKey: 'roleId' }); // Ajusta 'roleId' según tu campo de clave externa



User.afterSync(async () => {
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (adminRole) {
      const hashedPassword = await bcrypt.hash('admin1234', 10);
      await User.findOrCreate({
        where: { email: 'admin@uisek.com' },
        defaults: {
          username: 'admin',
          email: 'admin@uisek.com',
          password: hashedPassword,
          roleId: adminRole.id
        }
      });
    }
});
import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.config.js";

export const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.STRING,
    // allowNull: true
  }
}, {
  timestamps: false
});

Role.afterSync(async () => {
  const roles = [
    { name: 'admin', description: 'Administrator role' },
    { name: 'viewer', description: 'Viewer role' }
  ];

  for (const role of roles) {
    await Role.findOrCreate({ where: { name: role.name }, defaults: role });
  }
});
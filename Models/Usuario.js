const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Usuario = sequelize.define(
  'Usuario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'TECNICO', 'CLIENTE'),
      allowNull: false,
      defaultValue: 'CLIENTE',
    },
  },
  {
    tableName: 'usuarios',
    timestamps: false,
  }
);

module.exports = Usuario;

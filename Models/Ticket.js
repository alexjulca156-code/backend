const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Ticket = sequelize.define(
  'Ticket',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prioridad: {
      type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE'),
      allowNull: false,
      defaultValue: 'MEDIA',
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'EN_PROGRESO', 'RESUELTO', 'CERRADO'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    cliente_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tecnico_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'tickets',
    timestamps: false,
  }
);

module.exports = Ticket;

const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Categoria = sequelize.define(
  'Categoria',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'categorias',
    timestamps: false,
  }
);

Categoria.associate = ({ Ticket }) => {
  Categoria.hasMany(Ticket, { foreignKey: 'categoria_id', as: 'tickets' });
};

module.exports = Categoria;

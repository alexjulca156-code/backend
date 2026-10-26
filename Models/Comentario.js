const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Comentario = sequelize.define(
  'Comentario',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticket_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: 'comentarios',
    timestamps: false,
  }
);

Comentario.associate = ({ Ticket, Usuario }) => {
  Comentario.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
  Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
};

module.exports = Comentario;

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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM('ADMIN', 'TECNICO', 'CLIENTE'),
      allowNull: false,
      defaultValue: 'CLIENTE',
    },
    estado: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: 'usuarios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  }
);

Usuario.associate = ({ Ticket, Comentario }) => {
  Usuario.hasMany(Ticket, { foreignKey: 'cliente_id', as: 'tickets' });
  Usuario.hasMany(Ticket, { foreignKey: 'tecnico_id', as: 'ticketsAsignados' });
  Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });
};

module.exports = Usuario;

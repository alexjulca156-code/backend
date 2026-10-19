const express = require('express');
const sequelize = require('./Config/database');
const Categoria = require('./Models/Categoria');
const Comentario = require('./Models/Comentario');
const Ticket = require('./Models/Ticket');
const Usuario = require('./Models/Usuario');
const categoriaRoutes = require('./Routes/categoriaRoutes');
const comentarioRoutes = require('./Routes/comentarioRoutes');
const ticketRoutes = require('./Routes/ticketRoutes');
const usuarioRoutes = require('./Routes/usuarioRoutes');

Usuario.hasMany(Ticket, { foreignKey: 'cliente_id', as: 'tickets' });
Usuario.hasMany(Ticket, { foreignKey: 'tecnico_id', as: 'ticketsAsignados' });
Ticket.belongsTo(Usuario, {
  foreignKey: 'cliente_id',
  as: 'cliente',
  onDelete: 'RESTRICT',
});
Ticket.belongsTo(Usuario, { foreignKey: 'tecnico_id', as: 'tecnico' });
Categoria.hasMany(Ticket, { foreignKey: 'categoria_id', as: 'tickets' });
Ticket.belongsTo(Categoria, { foreignKey: 'categoria_id', as: 'categoria' });
Ticket.hasMany(Comentario, { foreignKey: 'ticket_id', as: 'comentarios' });
Comentario.belongsTo(Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
Usuario.hasMany(Comentario, { foreignKey: 'usuario_id', as: 'comentarios' });
Comentario.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/tickets', ticketRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/comentarios', comentarioRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

async function startServer() {
  await sequelize.authenticate();
  await sequelize.sync();
  console.info('Conexión a MySQL establecida.');

  app.listen(PORT, () => {
    console.info(`Servidor escuchando en el puerto ${PORT}.`);
  });
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('No se pudo iniciar la API:', error);
    process.exitCode = 1;
  });
}

module.exports = app;
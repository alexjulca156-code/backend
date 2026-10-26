require('dotenv').config();

const express = require('express');
const sequelize = require('./Config/database');
require('./Models');
const categoriaRoutes = require('./Routes/categoriaRoutes');
const comentarioRoutes = require('./Routes/comentarioRoutes');
const ticketRoutes = require('./Routes/ticketRoutes');
const usuarioRoutes = require('./Routes/usuarioRoutes');

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
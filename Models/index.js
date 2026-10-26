const Categoria = require('./Categoria');
const Comentario = require('./Comentario');
const Ticket = require('./Ticket');
const Usuario = require('./Usuario');

const models = {
  Categoria,
  Comentario,
  Ticket,
  Usuario,
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === 'function') {
    model.associate(models);
  }
});

module.exports = models;

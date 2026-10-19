const Comentario = require('../Models/Comentario');

const comentarioRepository = {
  findAll() {
    return Comentario.findAll({ order: [['id', 'DESC']] });
  },

  findById(id) {
    return Comentario.findByPk(id);
  },

  create(data) {
    return Comentario.create(data);
  },

  update(comentario, data) {
    return comentario.update(data);
  },

  delete(comentario) {
    return comentario.destroy();
  },
};

module.exports = comentarioRepository;

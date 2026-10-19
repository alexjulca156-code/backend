const Usuario = require('../Models/Usuario');

const usuarioRepository = {
  findAll() {
    return Usuario.findAll({ order: [['id', 'DESC']] });
  },

  findById(id) {
    return Usuario.findByPk(id);
  },

  create(data) {
    return Usuario.create(data);
  },

  update(usuario, data) {
    return usuario.update(data);
  },

  delete(usuario) {
    return usuario.destroy();
  },
};

module.exports = usuarioRepository;

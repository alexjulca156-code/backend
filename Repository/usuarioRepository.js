const Usuario = require('../Models/Usuario');

const usuarioRepository = {
  findAll() {
    return Usuario.findAll({ order: [['id', 'DESC']] });
  },

  findByEmail(email) {
    return Usuario.unscoped().findOne({ where: { email } });
  },

  findById(id) {
    return Usuario.findByPk(id);
  },

  create(data) {
    return Usuario.create(data);
  },

  updatePassword(usuario, password) {
    return usuario.update({ password });
  },

  update(usuario, data) {
    return usuario.update(data);
  },

  delete(usuario) {
    return usuario.destroy();
  },
};

module.exports = usuarioRepository;

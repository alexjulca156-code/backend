const Categoria = require('../Models/Categoria');

const categoriaRepository = {
  findAll() {
    return Categoria.findAll({ order: [['id', 'DESC']] });
  },

  findById(id) {
    return Categoria.findByPk(id);
  },

  create(data) {
    return Categoria.create(data);
  },

  update(categoria, data) {
    return categoria.update(data);
  },

  delete(categoria) {
    return categoria.destroy();
  },
};

module.exports = categoriaRepository;

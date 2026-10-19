const categoriaRepository = require('../Repository/categoriaRepository');

const categoriaFields = ['nombre', 'descripcion'];

function pickCategoriaFields(body) {
  return Object.fromEntries(
    categoriaFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

function isValidId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function isValidationError(error) {
  return error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeForeignKeyConstraintError';
}

function handleError(res, error, action) {
  console.error(`Error al ${action} categoría:`, error);
  const status = isValidationError(error) ? 400 : 500;
  return res.status(status).json({
    message: status === 400
      ? `No se pudo ${action} la categoría: verifica los datos y sus relaciones.`
      : `No se pudo ${action} la categoría por un error del servidor. Verifica la conexión y la estructura de la tabla.`,
  });
}

const categoriaController = {
  async getAll(req, res) {
    try {
      const categorias = await categoriaRepository.findAll();
      return res.json(categorias);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async getById(req, res) {
    const id = isValidId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El ID de la categoría no es válido.' });
    }

    try {
      const categoria = await categoriaRepository.findById(id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
      }
      return res.json(categoria);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async create(req, res) {
    const { nombre } = req.body || {};
    if (typeof nombre !== 'string' || nombre.trim().length === 0) {
      return res.status(400).json({
        message: 'El campo nombre es obligatorio y no puede estar vacío.',
      });
    }

    try {
      const categoria = await categoriaRepository.create(pickCategoriaFields(req.body));
      return res.status(201).json(categoria);
    } catch (error) {
      return handleError(res, error, 'crear');
    }
  },

  async update(req, res) {
    const id = isValidId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El ID de la categoría no es válido.' });
    }

    try {
      const categoria = await categoriaRepository.findById(id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
      }
      await categoriaRepository.update(categoria, pickCategoriaFields(req.body || {}));
      return res.json(categoria);
    } catch (error) {
      return handleError(res, error, 'actualizar');
    }
  },

  async delete(req, res) {
    const id = isValidId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El ID de la categoría no es válido.' });
    }

    try {
      const categoria = await categoriaRepository.findById(id);
      if (!categoria) {
        return res.status(404).json({ message: 'Categoría no encontrada.' });
      }
      await categoriaRepository.delete(categoria);
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error, 'eliminar');
    }
  },
};

module.exports = categoriaController;

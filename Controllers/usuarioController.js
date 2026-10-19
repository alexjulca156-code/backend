const usuarioRepository = require('../Repository/usuarioRepository');

const usuarioFields = ['nombre', 'email', 'rol'];

function pickUsuarioFields(body) {
  return Object.fromEntries(
    usuarioFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidationError(error) {
  return error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeForeignKeyConstraintError';
}

function handleError(res, error, action) {
  console.error(`Error al ${action} usuario:`, error);
  const status = isValidationError(error) ? 400 : 500;
  return res.status(status).json({
    message: status === 400
      ? `No se pudo ${action} el usuario: verifica que los datos sean válidos y que el email no esté registrado.`
      : `No se pudo ${action} el usuario por un error del servidor. Verifica la conexión y la estructura de la tabla.`,
  });
}

const usuarioController = {
  async getAll(req, res) {
    try {
      const usuarios = await usuarioRepository.findAll();
      return res.json(usuarios);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async getById(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'El ID del usuario no es válido.' });
    }

    try {
      const usuario = await usuarioRepository.findById(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      return res.json(usuario);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async create(req, res) {
    const { nombre, email } = req.body || {};
    if (!isNonEmptyString(nombre) || !isNonEmptyString(email)) {
      return res.status(400).json({
        message: 'Los campos nombre y email son obligatorios y no pueden estar vacíos.',
      });
    }

    try {
      const usuario = await usuarioRepository.create(pickUsuarioFields(req.body));
      return res.status(201).json(usuario);
    } catch (error) {
      return handleError(res, error, 'crear');
    }
  },

  async update(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'El ID del usuario no es válido.' });
    }

    try {
      const usuario = await usuarioRepository.findById(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      await usuarioRepository.update(usuario, pickUsuarioFields(req.body));
      return res.json(usuario);
    } catch (error) {
      return handleError(res, error, 'actualizar');
    }
  },

  async delete(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'El ID del usuario no es válido.' });
    }

    try {
      const usuario = await usuarioRepository.findById(id);
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado.' });
      }
      await usuarioRepository.delete(usuario);
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error, 'eliminar');
    }
  },
};

module.exports = usuarioController;

const comentarioRepository = require('../Repository/comentarioRepository');

const comentarioFields = ['ticket_id', 'usuario_id', 'mensaje'];

function pickComentarioFields(body) {
  return Object.fromEntries(
    comentarioFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
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
  console.error(`Error al ${action} comentario:`, error);
  const status = isValidationError(error) ? 400 : 500;
  return res.status(status).json({
    message: status === 400
      ? `No se pudo ${action} el comentario: verifica que los datos sean válidos y que el ticket y usuario existan.`
      : `No se pudo ${action} el comentario por un error del servidor. Verifica la conexión y la estructura de la tabla.`,
  });
}

const comentarioController = {
  async getAll(req, res) {
    try {
      const comentarios = await comentarioRepository.findAll();
      return res.json(comentarios);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async getById(req, res) {
    const id = isValidId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El ID del comentario no es válido.' });
    }

    try {
      const comentario = await comentarioRepository.findById(id);
      if (!comentario) {
        return res.status(404).json({ message: 'Comentario no encontrado.' });
      }
      return res.json(comentario);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async create(req, res) {
    const { ticket_id, usuario_id, mensaje } = req.body || {};
    if (
      !isPositiveInteger(ticket_id) ||
      !isPositiveInteger(usuario_id) ||
      typeof mensaje !== 'string' ||
      mensaje.trim().length === 0
    ) {
      return res.status(400).json({
        message: 'Los campos ticket_id, usuario_id y mensaje son obligatorios; los IDs deben ser enteros positivos y el mensaje no puede estar vacío.',
      });
    }

    try {
      const comentario = await comentarioRepository.create(pickComentarioFields(req.body));
      return res.status(201).json(comentario);
    } catch (error) {
      return handleError(res, error, 'crear');
    }
  },

  async update(req, res) {
    const id = isValidId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El ID del comentario no es válido.' });
    }

    try {
      const comentario = await comentarioRepository.findById(id);
      if (!comentario) {
        return res.status(404).json({ message: 'Comentario no encontrado.' });
      }
      await comentarioRepository.update(comentario, pickComentarioFields(req.body || {}));
      return res.json(comentario);
    } catch (error) {
      return handleError(res, error, 'actualizar');
    }
  },

  async delete(req, res) {
    const id = isValidId(req.params.id);
    if (!id) {
      return res.status(400).json({ message: 'El ID del comentario no es válido.' });
    }

    try {
      const comentario = await comentarioRepository.findById(id);
      if (!comentario) {
        return res.status(404).json({ message: 'Comentario no encontrado.' });
      }
      await comentarioRepository.delete(comentario);
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error, 'eliminar');
    }
  },
};

module.exports = comentarioController;

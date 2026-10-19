const ticketRepository = require('../Repository/ticketRepository');

const ticketFields = [
  'titulo',
  'descripcion',
  'prioridad',
  'estado',
  'cliente_id',
  'tecnico_id',
  'categoria_id',
];

function pickTicketFields(body) {
  return Object.fromEntries(
    ticketFields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

function isValidationError(error) {
  return error.name === 'SequelizeValidationError' ||
    error.name === 'SequelizeUniqueConstraintError' ||
    error.name === 'SequelizeForeignKeyConstraintError';
}

function handleError(res, error, action) {
  console.error(`Error al ${action} ticket:`, error);
  const status = isValidationError(error) ? 400 : 500;
  return res.status(status).json({
    message: status === 400
      ? `No se pudo ${action} el ticket: verifica los datos y las referencias a cliente, técnico y categoría.`
      : `No se pudo ${action} el ticket por un error del servidor. Verifica la conexión y la estructura de la tabla.`,
  });
}

const ticketController = {
  async getAll(req, res) {
    try {
      const tickets = await ticketRepository.findAll();
      return res.json(tickets);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async getById(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'El ID del ticket no es válido.' });
    }

    try {
      const ticket = await ticketRepository.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket no encontrado.' });
      }
      return res.json(ticket);
    } catch (error) {
      return handleError(res, error, 'consultar');
    }
  },

  async create(req, res) {
    const { titulo, descripcion, cliente_id } = req.body || {};
    if (
      !isNonEmptyString(titulo) ||
      !isNonEmptyString(descripcion) ||
      !isPositiveInteger(cliente_id)
    ) {
      return res.status(400).json({
        message: 'Los campos titulo, descripcion y cliente_id son obligatorios; cliente_id debe ser un entero positivo.',
      });
    }

    try {
      const ticket = await ticketRepository.create(pickTicketFields(req.body));
      return res.status(201).json(ticket);
    } catch (error) {
      return handleError(res, error, 'crear');
    }
  },

  async update(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'El ID del ticket no es válido.' });
    }

    try {
      const ticket = await ticketRepository.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket no encontrado.' });
      }
      await ticketRepository.update(ticket, pickTicketFields(req.body));
      return res.json(ticket);
    } catch (error) {
      return handleError(res, error, 'actualizar');
    }
  },

  async delete(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: 'El ID del ticket no es válido.' });
    }

    try {
      const ticket = await ticketRepository.findById(id);
      if (!ticket) {
        return res.status(404).json({ message: 'Ticket no encontrado.' });
      }
      await ticketRepository.delete(ticket);
      return res.status(204).end();
    } catch (error) {
      return handleError(res, error, 'eliminar');
    }
  },
};

module.exports = ticketController;

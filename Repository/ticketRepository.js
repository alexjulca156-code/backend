const Categoria = require('../Models/Categoria');
const Ticket = require('../Models/Ticket');
const Usuario = require('../Models/Usuario');

const ticketRepository = {
  findAll() {
    return Ticket.findAll({
      include: [
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre', 'email'] },
        { model: Usuario, as: 'tecnico', attributes: ['id', 'nombre', 'email'] },
        { model: Categoria, as: 'categoria' },
      ],
      order: [['id', 'DESC']],
    });
  },

  findById(id) {
    return Ticket.findByPk(id, {
      include: [
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre', 'email'] },
        { model: Usuario, as: 'tecnico', attributes: ['id', 'nombre', 'email'] },
        { model: Categoria, as: 'categoria' },
      ],
    });
  },

  create(data) {
    return Ticket.create(data);
  },

  update(ticket, data) {
    return ticket.update(data);
  },

  delete(ticket) {
    return ticket.destroy();
  },
};

module.exports = ticketRepository;

const express = require('express');
const ticketController = require('../Controllers/ticketController');

const router = express.Router();

router.get('/', ticketController.getAll);
router.get('/:id', ticketController.getById);
router.post('/', ticketController.create);
router.put('/:id', ticketController.update);
router.delete('/:id', ticketController.delete);

module.exports = router;

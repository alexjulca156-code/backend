const express = require('express');
const comentarioController = require('../Controllers/comentarioController');

const router = express.Router();

router.get('/', comentarioController.getAll);
router.get('/:id', comentarioController.getById);
router.post('/', comentarioController.create);
router.put('/:id', comentarioController.update);
router.delete('/:id', comentarioController.delete);

module.exports = router;

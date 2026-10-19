const express = require('express');
const categoriaController = require('../Controllers/categoriaController');

const router = express.Router();

router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.post('/', categoriaController.create);
router.put('/:id', categoriaController.update);
router.delete('/:id', categoriaController.delete);

module.exports = router;

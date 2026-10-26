const express = require('express');
const categoriaController = require('../Controllers/categoriaController');
const { authMiddleware, verificarRol } = require('../Middlewares/authMiddleware');

const router = express.Router();

router.get('/', categoriaController.getAll);
router.get('/:id', categoriaController.getById);
router.post('/', authMiddleware, verificarRol('ADMIN'), categoriaController.create);
router.put('/:id', authMiddleware, verificarRol('ADMIN'), categoriaController.update);
router.delete('/:id', authMiddleware, verificarRol('ADMIN'), categoriaController.delete);

module.exports = router;

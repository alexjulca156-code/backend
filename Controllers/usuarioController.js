const usuarioRepository = require('../Repository/usuarioRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const usuarioFields = ['nombre', 'email', 'rol'];

function pickUsuarioFields(body, fields = usuarioFields) {
  return Object.fromEntries(
    fields
      .filter((field) => Object.hasOwn(body, field))
      .map((field) => [field, body[field]])
  );
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function removePassword(usuario) {
  const data = usuario.toJSON();
  delete data.password;
  return data;
}

function isBcryptHash(value) {
  return /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/.test(value);
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
  async login(req, res) {
    const { email, password } = req.body || {};
    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({
        message: 'Los campos email y password son obligatorios.',
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('No se pudo iniciar sesión: JWT_SECRET no está configurado.');
      return res.status(500).json({
        message: 'La autenticación no está configurada correctamente.',
      });
    }

    try {
      const usuario = await usuarioRepository.findByEmail(email);
      if (!usuario || usuario.estado !== 1) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      const storedPassword = usuario.password;
      const passwordIsValid = isBcryptHash(storedPassword)
        ? await bcrypt.compare(password, storedPassword)
        : password === storedPassword;

      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
      }

      if (!isBcryptHash(storedPassword)) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await usuarioRepository.updatePassword(usuario, hashedPassword);
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          rol: usuario.rol,
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      return res.json({
        token,
        usuario: removePassword(usuario),
      });
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return res.status(500).json({
        message: 'No se pudo iniciar sesión por un error del servidor.',
      });
    }
  },

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
    const { nombre, email, password } = req.body || {};
    if (
      !isNonEmptyString(nombre) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(password)
    ) {
      return res.status(400).json({
        message: 'Los campos nombre, email y password son obligatorios y no pueden estar vacíos.',
      });
    }

    try {
      const data = pickUsuarioFields(req.body);
      data.password = await bcrypt.hash(password, 10);
      const usuario = await usuarioRepository.create(data);
      return res.status(201).json(removePassword(usuario));
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

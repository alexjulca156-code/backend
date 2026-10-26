const jwt = require('jsonwebtoken');

const allowedRoles = ['ADMIN', 'TECNICO', 'CLIENTE'];

function authMiddleware(req, res, next) {
  const authorization = req.get('authorization');
  if (typeof authorization !== 'string') {
    return res.status(401).json({ message: 'Se requiere un token de autenticación.' });
  }

  const [scheme, token, ...extraParts] = authorization.trim().split(/\s+/);
  if (
    scheme?.toLowerCase() !== 'bearer' ||
    !token ||
    extraParts.length > 0
  ) {
    return res.status(401).json({ message: 'El formato del token no es válido.' });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error('No se pudo verificar el token: JWT_SECRET no está configurado.');
    return res.status(500).json({
      message: 'La autenticación no está configurada correctamente.',
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    const message = error.name === 'TokenExpiredError'
      ? 'El token de autenticación ha expirado.'
      : 'El token de autenticación no es válido.';
    return res.status(401).json({ message });
  }

  if (
    !decoded ||
    typeof decoded !== 'object' ||
    typeof decoded.id !== 'number' ||
    typeof decoded.email !== 'string' ||
    !allowedRoles.includes(decoded.rol)
  ) {
    return res.status(401).json({ message: 'El token de autenticación no es válido.' });
  }

  req.usuario = decoded;
  return next();
}

function verificarRol(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ message: 'Se requiere autenticación.' });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        message: 'No tienes permisos para realizar esta acción.',
      });
    }

    return next();
  };
}

module.exports = { authMiddleware, verificarRol };

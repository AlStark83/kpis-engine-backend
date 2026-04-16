import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    return next();
  } catch (error) {
    console.error('[auth.verifyToken]', error);

    return res.status(401).json({
      success: false,
      message: 'Token invalido o expirado'
    });
  }
};

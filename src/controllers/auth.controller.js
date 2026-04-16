import jwt from 'jsonwebtoken';
import { conn as sequelize } from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_EXPIRATION = '8h';
const COOKIE_NAME = 'token';
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: false,
  maxAge: 8 * 60 * 60 * 1000
};

const getFirstRow = (result) => {
  if (Array.isArray(result)) {
    if (Array.isArray(result[0])) {
      return result[0][0] || null;
    }

    return result[0] || null;
  }

  return null;
};

const createSession = ({ res, payload }) => {
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRATION
  });

  res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
};

export const login = async (req, res) => {
  try {
    const { uslogin, password } = req.body;

    if (!uslogin || !password) {
      return res.status(400).json({
        success: false,
        message: 'uslogin y password son obligatorios'
      });
    }

    if (!sequelize || typeof sequelize.query !== 'function') {
      return res.status(500).json({
        success: false,
        message: 'La conexion a base de datos no esta disponible'
      });
    }

    const result = await sequelize.query(
      'EXEC usuario_CompruebaAcceso @uslogin = :uslogin, @password = :password',
      {
        replacements: { uslogin, password }
      }
    );

    const user = getFirstRow(result);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales invalidas'
      });
    }

    createSession({
      res,
      payload: {
        id: user.uslogin,
        rol: user.ustipo
      }
    });

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[auth.login]', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const validateDashboardToken = async (req, res) => {
  try {
    const token = req.body?.token || req.query?.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token es obligatorio'
      });
    }

    if (!sequelize || typeof sequelize.query !== 'function') {
      return res.status(500).json({
        success: false,
        message: 'La conexion a base de datos no esta disponible'
      });
    }

    const result = await sequelize.query(
      'EXEC sp_usuariodashboard_validatoken @token = :token',
      {
        replacements: { token }
      }
    );

    const user = getFirstRow(result);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token invalido'
      });
    }

    createSession({
      res,
      payload: {
        id: user.idUsuario,
        rol: user.idRol
      }
    });

    return res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('[auth.validateDashboardToken]', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    return res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('[auth.getMe]', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

import { z } from 'zod';
import { login as loginService } from './auth.service.js';

const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio'),
  password: z.string().min(1, 'El password es obligatorio')
});

export const login = async (req, res) => {
  try {
    const payload = loginSchema.parse(req.body);
    const result = await loginService(payload);

    res.status(result.success ? 200 : 401).json(result);
  } catch (error) {
    const statusCode = error.name === 'ZodError' ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Error al procesar el login'
    });
  }
};

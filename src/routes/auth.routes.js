import express from 'express';
import { getMe, login, validateDashboardToken } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/sso', validateDashboardToken);
router.get('/me', verifyToken, getMe);

export default router;

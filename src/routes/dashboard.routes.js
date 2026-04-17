import express from 'express';
import { getFiltros } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/filtros', getFiltros);

export default router;

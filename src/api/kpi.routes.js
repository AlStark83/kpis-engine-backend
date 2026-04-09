import express from 'express';
import { z } from 'zod';
import { runKPI } from '../services/kpi.service.js';

const router = express.Router();

const runKPISchema = z.object({
  kpi: z.string().min(1),
  filters: z.record(z.string(), z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number(), z.boolean()]))
  ])).optional().default({})
});

router.post('/run', async (req, res) => {
  try {
    const payload = runKPISchema.parse(req.body);
    const result = await runKPI(payload);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error running KPI:', error);

    const statusCode = error.name === 'ZodError' ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

export default router;

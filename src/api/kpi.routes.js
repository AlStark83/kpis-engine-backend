import express from 'express';
import { runKPI } from '../services/kpi.service.js';

const router = express.Router();



// POST /api/kpis/run
router.post('/run', async (req, res) => {
  try {
    const result = await runKPI(req.body);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error running KPI:', error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
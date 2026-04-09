import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';

import kpiRoutes from './api/kpi.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'KPI Engine running' });
});

app.use('/api/kpis', kpiRoutes);
app.use('/kpi', kpiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

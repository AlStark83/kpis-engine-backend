import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';


import kpiRoutes from './api/kpi.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ message: 'KPI Engine running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/kpis', kpiRoutes);
app.use('/kpi', kpiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

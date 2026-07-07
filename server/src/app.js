import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// --- Core middleware ---
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // logs each request in the terminal, useful while developing
}

// --- Health check, so we can quickly confirm the server is up ---
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'CampusOS API is running' });
});

// --- Main API routes ---
app.use('/api', apiRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;

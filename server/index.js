import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import testPlannerRouter from './routes/testPlanner.js';

// Load environment variables from .env file if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Configure CORS specifically for local Vite frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy: Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 2. Parse JSON request bodies
app.use(express.json());

// 3. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    service: 'QAverse API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// 4. Feature Routes
app.use('/api/test-planner', testPlannerRouter);

// 5. Catch-all 404 Handler for Unknown API Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'NotFound',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// 6. Central Error-Handling Middleware (safe, no stack trace exposed to client)
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  
  // Log the error internally for server logs
  console.error(`[Server Error] ${err.message || 'Unknown error'}`);

  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: statusCode === 500 ? 'An unexpected server error occurred.' : err.message
  });
});

// 7. Start Express Server
const server = app.listen(PORT, () => {
  console.log(`QAverse server is running on http://localhost:${PORT}`);
});

export default app;

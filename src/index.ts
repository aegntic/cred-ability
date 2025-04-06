import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { logger } from './common/logger';
import { apiRouter } from './api/routes';

// Load environment variables
dotenv.config();

// Create Express application
const app = express();
const port = process.env.PORT || 3000;

// Apply middlewares
app.use(helmet()); // Security headers
app.use(cors()); // Cross-Origin Resource Sharing
app.use(express.json()); // JSON body parsing
app.use(morgan('combined')); // HTTP request logging

// API routes
app.use('/api/v1', apiRouter);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  
  res.status(500).json({
    status: 'error',
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
    metadata: {
      timestamp: new Date().toISOString(),
    },
  });
});

// Start the server
app.listen(port, () => {
  logger.info(`CRED-ABILITY server started on port ${port}`, {
    environment: process.env.NODE_ENV || 'development',
  });
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  // Close connections, etc.
  process.exit(0);
});

export default app;

import express from 'express';
import { detectionsRouter } from './detections';
import { credentialsRouter } from './credentials';
import { recommendationsRouter } from './recommendations';
import { contextRouter } from './context';

const apiRouter = express.Router();

// Register API route groups
apiRouter.use('/detections', detectionsRouter);
apiRouter.use('/credentials', credentialsRouter);
apiRouter.use('/recommendations', recommendationsRouter);
apiRouter.use('/context', contextRouter);

export { apiRouter };

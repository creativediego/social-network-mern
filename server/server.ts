import dotenv from 'dotenv';
import path from 'path';
import express, { Response, Request } from 'express';
import { configDatabase } from './config/configDatabase';
import { Connection } from 'mongoose';
import { configExpressApp } from './config/configExpressApp';

dotenv.config();

// Config app and http server with middleware and dependencies.
const { app, httpServer, logger } = configExpressApp('/api');

// Set up dev or prod database connection with helper.
let db: Connection;
(async () => {
  try {
    db = await configDatabase(process.env.API_MONGO_URI!, logger);
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
})();

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve react app static files in production
if (process.env.NODE_ENV! === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.static(path.join(__dirname, '../../client/build'))); // serve react app
}

// Start server on specified port
httpServer.listen(process.env.API_PORT!, () => {
  logger.info(`Server running on port: ${process.env.API_PORT!}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Server shutting down...');
  try {
    // Close the MongoDB connection gracefully.
    await db.close();
    logger.info('Database connection closed.');

    // Close the HTTP server gracefully.
    httpServer.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

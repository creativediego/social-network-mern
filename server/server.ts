import dotenv from 'dotenv';
import express from 'express';
import connectToDatabase from './config/configDatabase';
import path from 'path';
import { app, httpServer } from './config/configExpress';
import { Connection } from 'mongoose';
dotenv.config();

// Set up db
let db: Connection;
(async () => {
  db = await connectToDatabase(process.env.MONGO_URI!);
})();

if (process.env.NODE_ENV! === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.static(path.join(__dirname, '../../client/build'))); // serve react app
}

httpServer.listen(process.env.PORT! || 4000, () => {
  console.log(`Server running on port: ${process.env.PORT! || 4000}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Server shutting down...');
  try {
    // Close the MongoDB connection gracefully.
    db.close();
    console.log('Database connection closed.');

    // Close the HTTP server gracefully.
    httpServer.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

import dotenv from 'dotenv';
import express, { Express, Response, Request } from 'express';
import connectToDatabase from './config/configDatabase';
import path from 'path';
import { Connection } from 'mongoose';
import { DependencyContainer } from './config/DependencyContainer';
import { Dep } from './config/Dependencies';
import { Server, createServer } from 'http';
import { registerDAOs } from './config/registerDAOs';
import { registerServices } from './config/registerServices';
import { registerControllers } from './config/registerControllers';
import { configMiddleWare } from './config/configExpress';
import { handleCentralError } from './errors/handleCentralError';
dotenv.config();

// Set up dependencies container that will be used to inject all dependencies.
// Begin with Express app and http server.
const dependencies = new DependencyContainer();
dependencies.register(Dep.App, [], () => express());
dependencies.register(Dep.HttpServer, [Dep.App], (app: Express) =>
  createServer(app)
);
const app = dependencies.get<Express>(Dep.App);
const httpServer = dependencies.get<Server>(Dep.HttpServer);

// Config middleware and init other dependencies
configMiddleWare(app);
registerDAOs(dependencies);
registerServices(dependencies);
registerControllers(dependencies);
app.use(handleCentralError);

// Example hello world route with typescript types.
app.get('/api', (req: Request, res: Response) => {
  res.send('Hello world!');
});

// Set up db with
let db: Connection;
(async () => {
  db = await connectToDatabase(process.env.API_MONGO_URI!);
})();

// Serve react app static files in production
if (process.env.ENV! === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.static(path.join(__dirname, '../../client/build'))); // serve react app
}

// Start server on specified port
httpServer.listen(process.env.API_PORT!, () => {
  console.log(`Server running on port: ${process.env.API_PORT!}`);
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

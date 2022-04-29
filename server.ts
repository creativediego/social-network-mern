import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import configGlobalMiddleware from './config/configGlobalMiddleware';
import createControllers from './config/createControllers';
import configDatabase from './config/configDatabase';
import { handleUncaughtException } from './errors/handleCentralError';
import path from 'path';
import { app, httpServer } from './config/configExpress';
dotenv.config();

configDatabase(process.env.MONGO_URL!);
configGlobalMiddleware(app);
createControllers(app);
handleUncaughtException();

if (process.env.NODE_ENV! === 'PRODUCTION') {
  app.set('trust proxy', 1); // trust first proxy
  app.use(express.static(path.join(__dirname, 'view/build')));
  app.get('*', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'view/build', 'index.html'));
  });
}

httpServer.listen(process.env.PORT! || 4000, () => {
  console.log(`Up and running on port ${process.env.PORT! || 4000}`);
});

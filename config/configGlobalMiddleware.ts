import express, { Express } from 'express';
import cors from 'cors';

const createGlobalMiddleware = (app: Express) => {
  app.use(express.json());
  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL!,
      methods: 'GET, POST, PUT, DELETE',
    })
  );
};

export default createGlobalMiddleware;

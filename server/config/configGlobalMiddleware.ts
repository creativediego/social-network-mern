import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

const createGlobalMiddleware = (app: Express) => {
  app.use(express.json());

  const allowedOrigins = [process.env.API_CLIENT_URL!, 'http://localhost'];

  app.use(
    cors({
      credentials: true,
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      allowedHeaders:
        'Content-Type, Authorization, Access-Control-Allow-Origin',
      methods: 'GET, POST, PUT, DELETE',
    })
  );

  // Manually handle OPTIONS requests
  // app.use((req: Request, res: Response, next: NextFunction) => {
  //   if (req.method === 'OPTIONS') {
  //     res.setHeader('Access-Control-Allow-Origin', '*');
  //     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  //     res.setHeader(
  //       'Access-Control-Allow-Headers',
  //       'Content-Type, Authorization'
  //     );
  //     res.status(200).end();
  //   } else {
  //     next();
  //   }
  // });
};

export default createGlobalMiddleware;

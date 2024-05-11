import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';

/**
 * configCors function.
 *
 * This function configures Cross-Origin Resource Sharing (CORS) for the Express application.
 * It uses the `cors` middleware from the `cors` package and the `json` middleware from the `express` package.
 *
 * The `allowedOrigins` array contains the origins that are allowed to access the application.
 * The `cors` middleware is configured to allow credentials, to check the origin of the request, and to allow certain headers and methods.
 *
 * If the origin of the request is not in the `allowedOrigins` array or is not provided, an error is passed to the callback of the `cors` middleware.
 *
 * @param {Express} app - The Express application.
 */
export const configCors = (app: Express) => {
  app.use(express.json());
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

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
};

import { StatusCode } from '../controllers/shared/HttpStatusCode';
import { Request, Response, NextFunction } from 'express';
import BaseError from './BaseError';
import { exit } from 'process';
import AuthException from '../controllers/auth/AuthException';
export const handleCentralError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log('Central error handler: ', err); // TODO: Add logger here.

  // if (err instanceof AuthException) {
  //   res.redirect(`${process.env.CLIENT_URL!}/error`);
  //   return;
  // }

  let clientResponse = {
    timestamp: Date.now,
    status: StatusCode.internalError,
    error: 'Sorry, something went wrong!',
    path: req.path,
  };
  if (err instanceof BaseError) {
    clientResponse.status = err.code;
    clientResponse.error = err.message;
  }

  // if (err instanceof BaseError && err.code === StatusCode.notFound) {
  //   clientResponse.error = 'Sorry, resource not found!';
  // }

  // if (err instanceof BaseError && err.isOperational) {
  res.status(clientResponse.status).json(clientResponse);
  // }

  // if (!(err instanceof BaseError && err.isOperational)) {
  //   exit(1); // exit in the case of uncaught unexpected errors
  // }
};

export const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    if (!(err instanceof BaseError && err.isOperational)) {
      exit(1); // exit in the case of uncaught unexpected errors
    }
    console.log('Uncaught Exception: ', err);
    //TODO: Log error
  });
};

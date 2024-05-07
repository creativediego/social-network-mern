import { Code } from '../enums/StatusCode';
import { Request, Response, NextFunction } from 'express';
import BaseError from '../errors/BaseError';
import { exit } from 'process';
export const handleCentralError = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // TODO: Handle different error types here.

  console.log('Central error handler: ', err); // TODO: Add logger here.

  let errorResponse = {
    timestamp: Date.now,
    code: Code.internalError,
    message: 'Sorry, something went wrong!',
    path: req.path,
  };
  if (err instanceof BaseError) {
    errorResponse.code = err.code;
    errorResponse.message = err.message;
  }
  res.status(errorResponse.code).json({ error: errorResponse });
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

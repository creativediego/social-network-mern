import { exit } from 'process';
import BaseError from '../errors/BaseError';
import { ILogger } from '../logger/ILogger';

export const handleUncaughtException = (logger: ILogger) => {
  process.on('uncaughtException', (err) => {
    if (!(err instanceof BaseError && err.isOperational)) {
      exit(1); // exit in the case of uncaught unexpected errors
    }
    logger.error('Uncaught Exception: ', err);
  });
};

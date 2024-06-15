import { exit } from 'process';
import BaseError from '../errors/BaseError';
import { ILogger } from '../logger/ILogger';

/**
 * Handles uncaught exceptions in the application. Logs the error and exits the process.
 */
export const handleUncaughtException = (logger: ILogger) => {
  process.on('uncaughtException', (err) => {
    if (!(err instanceof BaseError && err.isOperational)) {
      exit(1); // exit in the case of uncaught unexpected errors
    }
    logger.error('Uncaught Exception: ', err);
  });
};

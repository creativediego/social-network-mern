import { Logger } from 'winston';
import { ILogger } from './ILogger';
import BaseError from '../errors/BaseError';

export class CustomLogger implements ILogger {
  private logger: Logger;

  public constructor(logger: Logger) {
    this.logger = logger;
  }
  public debug = (message: string): void => {
    this.logger.debug(message);
  };

  public info = (message: string): void => {
    this.logger.info(message);
  };

  public warn = (message: string): void => {
    this.logger.warn(message);
  };

  public error = (message: string, error?: unknown): void => {
    this.logger.error(message, error);
  };
}

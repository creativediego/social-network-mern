import { Logger } from 'winston';
import { ILogger } from './ILogger';

/**
 * Custom logger class that implements ILogger interface. It contains methods that log debug, info, warn, and error messages.
 */
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

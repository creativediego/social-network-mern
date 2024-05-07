import BaseError from '../errors/BaseError';

export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
  error(message: string, error?: unknown): void;
}

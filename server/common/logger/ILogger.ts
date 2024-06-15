/**
 * Generic logger interface that contains methods to log debug, info, warn, and error messages.
 */
export interface ILogger {
  info(message: string): void;
  warn(message: string): void;
  debug(message: string): void;
  error(message: string, error?: unknown): void;
}

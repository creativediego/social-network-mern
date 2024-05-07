import { createLogger, format, transports } from 'winston';
import { format as dateFormat } from 'date-fns';
const { combine, timestamp, printf, colorize } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});
// Determine the log level based on the environment
const logLevel = process.env.ENV === 'production' ? 'info' : 'debug';

// Create the logger instance
export const winstonLogger = createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: () => dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss') }),
    format.errors({ stack: true }),
    colorize(),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to console in all environments
    ...(process.env.ENV === 'production'
      ? [
          new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to a file in production
          new transports.File({ filename: 'combined.log' }), // Log info and debug to a separate file in production
        ]
      : []), // No additional file transports in development
  ],
});

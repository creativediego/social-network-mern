import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

// Define a custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});
// Determine the log level based on the environment
const logLevel = process.env.ENV === 'production' ? 'info' : 'debug';

const formatDate = () => {
  const date = new Date();
  const pad = (num: number): string => (num < 10 ? '0' + num : num.toString());
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Create the logger instance
export const winstonLogger = createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: formatDate }),
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

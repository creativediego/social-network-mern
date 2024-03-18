import { AxiosError } from 'axios';
import { FriendlyError, IAlert } from '../interfaces/IError';

export interface ILogger<T, U> {
  logError: (error: T) => U;
}

// Concrete implementation of ILogger with singleton pattern
class Logger implements ILogger<IAlert, Promise<void>> {
  private static instance: Logger;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public logError = async (error: IAlert): Promise<void> => {
    // If in production, log error to third-party service.
    if (process.env.REACT_APP_ENV === 'production') {
      // TODO: Log error to third-party service.
    } else {
      console.log(error.message);
    }
  };
}

export const logger = Logger.getInstance();

export const logError = async (error: IAlert): Promise<void> => {
  // If in production, log error to third-party service.
  if (process.env.REACT_APP_ENV === 'production') {
    // TODO: Log error to third-party service.
  } else {
    console.log(error);
  }
};

export const isError = (value: any): value is FriendlyError => {
  return value instanceof FriendlyError;
};

export const handleError = <T>(errorMessage?: string) => {
  return (error: AxiosError): T => {
    if (!error.response) {
      throw new Error('Network Error');
    }
    logError(error.response.data.error || { message: error.response.data });
    throw new Error(
      errorMessage ||
        error.response.data.message ||
        'Sorry, something went wrong!'
    );
  };
};

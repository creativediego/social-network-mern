import { AxiosError } from 'axios';
import { FriendlyError, IAlert, IGlobalError } from '../interfaces/IError';

export const logError = async (error: IAlert): Promise<void> => {
  // If in production, log error to third-party service.
  if (process.env.REACT_APP_ENV === 'production') {
    // TODO: Log error to third-party service.
  } else {
    console.log(error.message);
  }
};

export const isError = (value: any): value is FriendlyError => {
  return value instanceof FriendlyError;
};

export const handleError = <T>(errorMessage?: string) => {
  return (error: AxiosError<IGlobalError>): T => {
    if (!error.response) {
      throw new Error('Network Error');
    }
    logError(error.response.data || { message: error.message });
    throw new Error(
      errorMessage || error.response.data.message || 'Unknown Error'
    );
  };
};

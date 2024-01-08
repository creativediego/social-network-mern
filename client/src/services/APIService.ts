import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { ILogger, logger } from '../util/apiErrorHandling';
import { IAlert } from '../interfaces/IError';

export enum Requests {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface APIServiceI {
  makeRequest<T, U = undefined>(
    url: string,
    method: Requests,
    errorMessage?: string,
    data?: U
  ): Promise<T>;
}

class APIServiceImpl implements APIServiceI {
  private API = axios.create();
  private logger: ILogger<AxiosError, Promise<void>>;

  private constructor(logger: ILogger<AxiosError, Promise<void>>) {
    // only gets called once when the instance is created in the static method below
    this.API.interceptors.request.use(this.setHeaders);
    this.logger = logger;
  }

  private handleError = <T>(errorMessage?: string) => {
    return (error: AxiosError): T => {
      if (!error.response) {
        throw new Error('Network Error');
      }
      this.logger.logError(
        error.response.data.error || { message: error.response.data }
      );
      throw new Error(
        errorMessage ||
          error.response.data.message ||
          'Sorry, something went wrong!'
      );
    };
  };

  private setHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
    const token = localStorage.getItem('token');

    if (config.headers) {
      config.headers.authorization = `Bearer ${token}`;
    } else {
      config.headers = {
        authorization: `Bearer ${token}`,
      };
    }

    return config;
  }

  public makeRequest = async <T, U = undefined>(
    url: string,
    method: Requests,
    errorMessage?: string,
    data?: U
  ): Promise<T> => {
    try {
      const response: AxiosResponse = await this.API({
        method,
        url,
        data,
      });
      return response.data;
    } catch (error) {
      this.handleError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  private static instance: APIServiceImpl;

  public static getInstance(
    logger: ILogger<IAlert, Promise<void>>
  ): APIServiceImpl {
    if (!APIServiceImpl.instance) {
      APIServiceImpl.instance = new APIServiceImpl(logger);
    }
    return APIServiceImpl.instance;
  }
}

export const apiService = APIServiceImpl.getInstance(logger);
export const callAPI = apiService.makeRequest;
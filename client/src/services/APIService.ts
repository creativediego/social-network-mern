import axios, {
  AxiosResponse,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
// import { ILogger, logger } from '../util/apiErrorHandling';
import { IAlert } from '../interfaces/IError';
import { IServerError } from '../interfaces/IServerError';

export enum ReqType {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export interface APIServiceI {
  makeRequest<T, U = undefined>(
    url: string,
    method: ReqType,
    errorMessage?: string,
    data?: U
  ): Promise<T>;
}

class APIServiceImpl implements APIServiceI {
  private API = axios.create();

  private constructor() {
    // only gets called once when the instance is created in the static method below
    this.API.interceptors.request.use(this.setHeaders); // Bind the context of 'this' to the setHeaders method
  }

  private setHeaders(
    config: AxiosRequestConfig
  ):
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>> {
    const token = localStorage.getItem('token');

    if (config.headers) {
      config.headers.authorization = `Bearer ${token}`;
    } else {
      config.headers = {
        authorization: `Bearer ${token}`,
      };
    }

    return config as InternalAxiosRequestConfig<any>;
  }

  private handleError = (
    error: AxiosError<IServerError>,
    errorMessage?: string
  ) => {
    if (!error.response) {
      throw new Error(
        'Network Error: Cannot reach server. Please try again later.'
      );
    }

    if (error.response.status === 401) {
      throw new Error('401');
    }

    throw new Error(
      errorMessage ||
        error.response.data.error.message ||
        'Sorry, something went wrong!'
    );
  };

  // private setHeaders(config: AxiosRequestConfig): AxiosRequestConfig {
  //   const token = localStorage.getItem('token');

  //   if (config.headers) {
  //     config.headers.authorization = `Bearer ${token}`;
  //   } else {
  //     config.headers = {
  //       authorization: `Bearer ${token}`,
  //     };
  //   }

  //   return config;
  // }

  public makeRequest = async <T, U = undefined>(
    url: string,
    method: ReqType,
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
    } catch (err) {
      const error = err as AxiosError<IServerError>;
      this.handleError(error, errorMessage);
      throw new Error(errorMessage);
    }
  };

  private static instance: APIServiceImpl;

  public static getInstance(): APIServiceImpl {
    if (!APIServiceImpl.instance) {
      APIServiceImpl.instance = new APIServiceImpl();
    }
    return APIServiceImpl.instance;
  }
}

export const apiService = APIServiceImpl.getInstance();
export const callAPI = apiService.makeRequest;

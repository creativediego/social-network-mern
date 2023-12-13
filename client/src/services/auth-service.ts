import axios from 'axios';
import { IUser } from '../interfaces/IUser';
import { Requests, callAPI } from './api-helpers';
import { loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const SECURITY_API = config.authApi;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);

export const register = (user: IUser) =>
  callAPI<IUser>(
    `${SECURITY_API}/register`,
    Requests.POST,
    'Error registering. Try again later.'
  );

export const registerWithGoogle = (email: string) =>
  callAPI<IUser>(
    `${SECURITY_API}/registerWithGoogle`,
    Requests.POST,
    { email: email },
    'Error registering with Google. Try again later.'
  );

export const loginWithGoogle = (token: string) =>
  callAPI<IUser>(
    `${SECURITY_API}/login`,
    Requests.POST,
    { token },
    'Error logging in with Google. Try again later.'
  );

export const getProfile = () =>
  callAPI<IUser>(
    `${SECURITY_API}/profile`,
    Requests.GET,
    undefined,
    'Error getting profile. Try again later.'
  );

import axios from 'axios';
import { IUser } from '../interfaces/IUser';
import { Requests, callAPI } from './api-helpers';
import { loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';
import {
  fireBaseRegisterUser,
  firebaseGoogleLogin,
  firebaseLoginWithEmail,
  firebaseLogout,
  isFirebaseIsEmailProvider,
} from './firebase-auth';

const SECURITY_API = config.authApi;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);

export const AUTHregister = async (email: string, password: string) =>
  await fireBaseRegisterUser(email, password);

export const AUTHlogin = async (email: string, password: string) =>
  await firebaseLoginWithEmail(email, password);

export const AUTHloginWithGoogle = async () => await firebaseGoogleLogin();

export const AUTHlogout = async () => await firebaseLogout;

export const registeredWithEmailPassword = async () =>
  await isFirebaseIsEmailProvider();

export const getProfile = () =>
  callAPI<IUser>(
    `${SECURITY_API}/profile`,
    Requests.GET,
    undefined,
    'Error getting profile. Try again later.'
  );

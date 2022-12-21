import axios from 'axios';
import { IUser } from '../interfaces/IUser';
import { processError } from './helpers';
import { loadRequestInterceptors } from './helpers';
const SECURITY_API = `${process.env.REACT_APP_API_URL}/auth`;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);

export const register = (user: IUser) =>
  api
    .post(`${SECURITY_API}/register`, user)
    .then((response) => response.data)
    .catch((err) => err.response.data);

export const login = (user: IUser) =>
  api
    .post(`${SECURITY_API}/login`, user)
    .then((response) => response.data)
    .catch((err) => err.response.data);

export const getProfile = () =>
  api
    .get(`${SECURITY_API}/profile`)
    .then((response) => response.data)
    .catch((err) => processError(err));
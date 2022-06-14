import axios from 'axios';
import { processError } from './helpers';
import { loadRequestInterceptors } from './helpers';
const TUITS_API = `${process.env.REACT_APP_API_URL}/tuits`;
const USERS_API = `${process.env.REACT_APP_API_URL}/users`;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(loadRequestInterceptors);

// let token = localStorage.getItem('tuiterToken');
// const config = {
//   headers: {
//     Authorization: 'Bearer ' + token,
//   },
// };

export const findAllTuitsByKeyword = (keyword) =>
  api
    .get(`${TUITS_API}/search/${keyword}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findAllTuits = () =>
  api
    .get(TUITS_API)
    .then((response) => response.data)
    .catch((err) => processError(err));

// export const findTuitById = (tuitId) =>
//   api
//     .get(`${TUITS_API}/${tuitId}`)
//     .then((response) => response.data)
//     .catch((err) => processError(err));

export const findTuitsByUser = (userId) =>
  api
    .get(`${USERS_API}/${userId}/tuits`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const createTuit = (userId, tuit) =>
  api
    .post(`${USERS_API}/${userId}/tuits`, tuit)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const updateTuit = (tuitId, tuit) =>
  api
    .put(`${TUITS_API}/${tuitId}`, tuit)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const deleteTuit = (tuitId) =>
  api
    .delete(`${TUITS_API}/${tuitId}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

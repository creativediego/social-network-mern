import axios from 'axios';
import { processError } from './helpers';
import { setHeaders } from './helpers';
const TUITS_API = `${process.env.REACT_APP_API_URL}/tuits`;
const USERS_API = `${process.env.REACT_APP_API_URL}/users`;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(setHeaders);

// let token = localStorage.getItem('tuiterToken');
// const config = {
//   headers: {
//     Authorization: 'Bearer ' + token,
//   },
// };

export const findAllTuits = () =>
  api
    .get(TUITS_API)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findTuitById = (tuitId) =>
  api
    .get(`${TUITS_API}/${tuitId}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findTuitsByUser = (userId) => {
  console.log(api.defaults.headers.common['authorization']);
  return api
    .get(`${USERS_API}/${userId}/tuits`)
    .then((response) => response.data)
    .catch((err) => processError(err));
};

export const createTuit = (userId, tuit) =>
  api
    .post(`${USERS_API}/${userId}/tuits`, { tuit: tuit })
    .then((response) => response.data)
    .catch((err) => processError(err));

export const updateTuit = (tuitId, tuit) =>
  api
    .post(`${TUITS_API}/${tuitId}`, tuit)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const deleteTuit = (tuitId) =>
  api
    .delete(`${TUITS_API}/${tuitId}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

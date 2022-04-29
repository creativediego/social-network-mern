import axios from 'axios';
import { processError } from './helpers';

const TUITS_API = `${process.env.REACT_APP_API_URL}/tuits`;
const USERS_API = `${process.env.REACT_APP_API_URL}/users`;

export const api = axios.create({ withCredentials: true });

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

export const findTuitsByUser = (userId) =>
  api
    .get(`${USERS_API}/${userId}/tuits`)
    .then((response) => response.data)
    .catch((err) => processError(err));

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

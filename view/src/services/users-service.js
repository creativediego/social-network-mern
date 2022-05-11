import axios from 'axios';
import { processError } from './helpers';
import { setHeaders } from './helpers';
const BASE_URL = process.env.REACT_APP_API_URL;

const LOGIN_API = `${BASE_URL}/login`;
const USERS_API = `${BASE_URL}/users`;

const api = axios.create();
// api.defaults.headers.common['authorization'] = localStorage.getItem('token');
api.interceptors.request.use(setHeaders);
/*
 * This service will expose functions which can create, retrieve, update and delete objects of the the users resource by hitting API endpoints in the backend server.
 */

// Create a user based on the given user object
export const createUser = (user) =>
  api.post(`${USERS_API}`, user).then((response) => response.data);

// Update a user based on the given user object
export const updateUser = (user) =>
  api
    .put(`${USERS_API}/${user.id}`, user)
    .then((response) => response.data)
    .catch((err) => err.response.data);

// Find all users in the system. Primarily useful for testing purposes.
export const findAllUsers = () =>
  api
    .get(USERS_API)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findAllByName = (nameOrUsername) =>
  api
    .post(`${USERS_API}/${nameOrUsername}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

// Find a user by the given id.
export const findUserById = (uid) =>
  api
    .get(`${USERS_API}/${uid}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

export const findUserByUsername = (username) =>
  api
    .get(`${USERS_API}/profile/${username}`)
    .then((response) => response.data)
    .catch((err) => processError(err));

// Delete a user by the given id
export const deleteUser = (uid) =>
  api.delete(`${USERS_API}/${uid}`).then((response) => response.data);

// Delete a user by the given username
export const deleteUsersByUsername = (username) =>
  api
    .get(`${USERS_API}/username/${username}/delete`)
    .then((response) => response.data);

// Find a user by their credentials
export const findUserByCredentials = (credentials) =>
  api.post(`${LOGIN_API}`, credentials).then((response) => response.data);

const service = {
  findAllUsers,
};

export default service;

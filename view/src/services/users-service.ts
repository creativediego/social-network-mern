import { IUser } from '../interfaces/IUser';
import { makeAPICall } from './helpers';
import { Requests } from './helpers';

const BASE_URL = process.env.REACT_APP_API_URL;
const LOGIN_API = `${BASE_URL}/login`;
const USERS_API = `${BASE_URL}/users`;

// Create a user based on the given user object
export const createUser = (user: IUser) =>
  makeAPICall(`${USERS_API}`, Requests.POST, user);

// Update a user based on the given user object
export const updateUser = (user: IUser) =>
  makeAPICall(`${USERS_API}/${user.id}`, Requests.PUT, user);

// Find all users in the system. Primarily useful for testing purposes.
export const findAllUsers = () => makeAPICall(`${USERS_API}`, Requests.GET);

export const findAllByName = (nameOrUsername: string) =>
  makeAPICall(`${USERS_API}/${nameOrUsername}`, Requests.POST);

// Find a user by the given id.
export const findUserById = (uid: number) =>
  makeAPICall(`${USERS_API}/${uid}`, Requests.GET);

export const findUserByUsername = (username: string) =>
  makeAPICall(`${USERS_API}/profile/${username}`, Requests.GET);

// Delete a user by the given id
export const deleteUser = (uid: number) =>
  makeAPICall(`${USERS_API}/${uid}`, Requests.DELETE);

// Delete a user by the given username
export const deleteUsersByUsername = (username: string) =>
  makeAPICall(`${USERS_API}/username/${username}/delete`, Requests.GET);

// Find a user by their credentials
export const findUserByCredentials = (credentials: string) =>
  makeAPICall(`${LOGIN_API}`, Requests.POST, credentials);

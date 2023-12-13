import { IUser } from '../interfaces/IUser';
import { callAPI } from './api-helpers';
import { Requests } from './api-helpers';
import { config } from '../config/appConfig';

const LOGIN_API = `${config.apiURL}/login`;
const USERS_API = `${config.apiURL}/users`;

// Create a user based on the given user object
export const createUser = (user: IUser) =>
  callAPI<IUser>(`${USERS_API}`, Requests.POST, user);

// Update a user based on the given user object
export const updateUser = (user: IUser) =>
  callAPI<IUser>(`${USERS_API}/${user.id}`, Requests.PUT, user);

// Find all users in the system. Primarily useful for testing purposes.
export const findAllUsers = () =>
  callAPI<IUser[]>(`${USERS_API}`, Requests.GET);

export const findAllUsersByName = (nameOrUsername: string) =>
  callAPI<IUser[]>(`${USERS_API}/${nameOrUsername}`, Requests.POST);

// Find a user by the given id.
export const findUserById = (uid: string) =>
  callAPI<IUser>(`${USERS_API}/${uid}`, Requests.GET);

export const findUserByUsername = (username: string) =>
  callAPI<IUser>(`${USERS_API}/profile/${username}`, Requests.GET);

// Delete a user by the given id
export const deleteUser = (uid: number) =>
  callAPI<IUser>(`${USERS_API}/${uid}`, Requests.DELETE);

// Delete a user by the given username
export const deleteUsersByUsername = (username: string) =>
  callAPI<IUser[]>(`${USERS_API}/username/${username}/delete`, Requests.DELETE);

// Find a user by their credentials
export const findUserByCredentials = (credentials: string) =>
  callAPI<IUser[]>(`${LOGIN_API}`, Requests.POST, credentials);

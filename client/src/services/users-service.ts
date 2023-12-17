import { IUser } from '../interfaces/IUser';
import { callAPI } from './api-helpers';
import { Requests } from './api-helpers';
import { config } from '../config/appConfig';

const LOGIN_API = `${config.apiURL}/login`;
const USERS_API = `${config.apiURL}/users`;

// Create a user based on the given user object
export const APIcreateUser = (user: IUser) =>
  callAPI<IUser>(`${USERS_API}`, Requests.POST, user);

// Update a user based on the given user object
export const APIupdateUser = (user: IUser) =>
  callAPI<IUser>(`${USERS_API}/${user.id}`, Requests.PUT, user);

// Find all users in the system. Primarily useful for testing purposes.
export const APIfindAllUsers = () =>
  callAPI<IUser[]>(`${USERS_API}`, Requests.GET);

export const APIfindAllUsersByName = (nameOrUsername: string) =>
  callAPI<IUser[]>(`${USERS_API}/${nameOrUsername}`, Requests.POST);

// Find a user by the given id.
export const APIfindUserById = (uid: string) =>
  callAPI<IUser>(`${USERS_API}/${uid}`, Requests.GET);

export const APIfindUserByUsername = (username: string) =>
  callAPI<IUser>(`${USERS_API}/profile/${username}`, Requests.GET);

// Delete a user by the given id
export const APIdeleteUser = (uid: number) =>
  callAPI<IUser>(`${USERS_API}/${uid}`, Requests.DELETE);

// Delete a user by the given username
export const APIdeleteUsersByUsername = (username: string) =>
  callAPI<IUser[]>(`${USERS_API}/username/${username}/delete`, Requests.DELETE);

// Find a user by their credentials
export const APIfindUserByCredentials = (credentials: string) =>
  callAPI<IUser[]>(`${LOGIN_API}`, Requests.POST, credentials);

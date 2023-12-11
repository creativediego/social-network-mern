import { IUser } from '../interfaces/IUser';
import { makeAPICall } from './helpers';
import { Requests } from './helpers';
import { config } from '../config/appConfig';

const LOGIN_API = `${config.apiURL}/login`;
const USERS_API = `${config.apiURL}/users`;

// Create a user based on the given user object
export const createUser = (user: IUser) =>
  makeAPICall<IUser>(`${USERS_API}`, Requests.POST, user);

// Update a user based on the given user object
export const updateUser = (user: IUser) =>
  makeAPICall<IUser>(`${USERS_API}/${user.id}`, Requests.PUT, user);

// Find all users in the system. Primarily useful for testing purposes.
export const findAllUsers = () =>
  makeAPICall<IUser[]>(`${USERS_API}`, Requests.GET);

export const findAllUsersByName = (nameOrUsername: string) =>
  makeAPICall<IUser[]>(`${USERS_API}/${nameOrUsername}`, Requests.POST);

// Find a user by the given id.
export const findUserById = (uid: string) =>
  makeAPICall<IUser>(`${USERS_API}/${uid}`, Requests.GET);

export const findUserByUsername = (username: string) =>
  makeAPICall<IUser>(`${USERS_API}/profile/${username}`, Requests.GET);

// Delete a user by the given id
export const deleteUser = (uid: number) =>
  makeAPICall<IUser>(`${USERS_API}/${uid}`, Requests.DELETE);

// Delete a user by the given username
export const deleteUsersByUsername = (username: string) =>
  makeAPICall<IUser[]>(
    `${USERS_API}/username/${username}/delete`,
    Requests.DELETE
  );

// Find a user by their credentials
export const findUserByCredentials = (credentials: string) =>
  makeAPICall<IUser[]>(`${LOGIN_API}`, Requests.POST, credentials);

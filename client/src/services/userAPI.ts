import { IUser } from '../interfaces/IUser';
import { callAPI } from '../util/apiConfig';
import { Requests } from '../util/apiConfig';
import { configENV } from '../config/appConfig';

const LOGIN_API = `${configENV.apiURL}/login`;
const USERS_API = `${configENV.apiURL}/users`;

// Create a user based on the given user object
export const APIcreateUser = (user: IUser) =>
  callAPI<IUser, IUser>(
    `${USERS_API}`,
    Requests.POST,
    'Error creating user. Try again later.',
    user
  );

// Update a user based on the given user object
export const APIupdateUser = (user: IUser) =>
  callAPI<IUser, IUser>(
    `${USERS_API}/${user.id}`,
    Requests.PUT,
    'Error updating user. Try again later.',
    user
  );

// Find all users in the system. Primarily useful for testing purposes.
export const APIfindAllUsers = () =>
  callAPI<IUser[]>(`${USERS_API}`, Requests.GET, 'Error finding users.');

export const APIfindAllUsersByName = (nameOrUsername: string) =>
  callAPI<IUser[]>(
    `${USERS_API}/${nameOrUsername}`,
    Requests.POST,
    'Error finding users.'
  );

// Find a user by the given id.
export const APIfindUserById = (uid: string) =>
  callAPI<IUser>(`${USERS_API}/${uid}`, Requests.GET, 'Error finding user.');

export const APIfindUserByUsername = (username: string) =>
  callAPI<IUser>(
    `${USERS_API}/profile/${username}`,
    Requests.GET,
    'Error finding user.'
  );

// Delete a user by the given id
export const APIdeleteUser = (uid: number) =>
  callAPI<IUser>(
    `${USERS_API}/${uid}`,
    Requests.DELETE,
    'Error deleting user.'
  );

// Delete a user by the given username
export const APIdeleteUsersByUsername = (username: string) =>
  callAPI<IUser[]>(
    `${USERS_API}/username/${username}/delete`,
    Requests.DELETE,
    'Error deleting user.'
  );

// Find a user by their credentials
export const APIfindUserByCredentials = (credentials: string) =>
  callAPI<IUser[], string>(
    `${LOGIN_API}`,
    Requests.POST,
    'Error finding user by credentials.',
    credentials
  );

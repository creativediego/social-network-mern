import axios from 'axios';
import { Requests, callAPI, loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';
import IFollow from '../interfaces/IFollow';
import { IUser } from '../interfaces/IUser';

const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);
// This service exposes operations relating to the follows resource, by calling the backend Follows API

// Create a Follows object encompassing the relationship between the given users
export const APIfollowUser = (userId: string, followeeId: string) =>
  callAPI<IFollow>(`${USERS_API}/${userId}/follows`, Requests.POST, {
    followeeId,
  });

// Delete the Follows object encompassing the relationship between the given users
export const APIunfollowUser = async (uid: string, followeeId: string) =>
  callAPI<IFollow>(`${USERS_API}/${uid}/follows`, Requests.DELETE, {
    data: followeeId,
  });

// Find all followers for the given user id
export const APIfindAllFollowers = (uid: string) =>
  callAPI<IUser[]>(`${USERS_API}/${uid}/followers`, Requests.GET);

import axios from 'axios';
import { Requests, callAPI, loadRequestInterceptors } from './api-helpers';
import { config } from '../config/appConfig';

const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);
// This service exposes operations relating to the follows resource, by calling the backend Follows API

// Create a Follows object encompassing the relationship between the given users
export const followUser = (userId: string, followeeId: string) =>
  callAPI(`${USERS_API}/${userId}/follows`, Requests.POST, { followeeId });

// Delete the Follows object encompassing the relationship between the given users
export const unfollowUser = async (uid: string, followeeId: string) => {
  callAPI(`${USERS_API}/${uid}/follows`, Requests.DELETE, { data: followeeId });
};

// Find all followers for the given user id
export const findAllFollowers = (uid: string) =>
  callAPI(`${USERS_API}/${uid}/followers`, Requests.GET);

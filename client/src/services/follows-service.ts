import axios from 'axios';
import { loadRequestInterceptors } from './helpers';
import { config } from '../config/appConfig';

const USERS_API = `${config.apiURL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);
// This service exposes operations relating to the follows resource, by calling the backend Follows API

// Create a Follows object encompassing the relationship between the given users
export const followUser = (userId: string, followeeId: string) =>
  api
    .post(`${USERS_API}/${userId}/follows`, { followeeId: followeeId })
    .then((response) => response.data)
    .catch((err) => err.response.data);

// Delete the Follows object encompassing the relationship between the given users
export const unfollowUser = async (uid: string, followeeId: string) => {
  return api
    .delete(`${USERS_API}/${uid}/follows`, {
      data: { followeeId },
    })
    .then((response) => response.data)
    .catch((err) => err.response.data);
};

// Find all followers for the given user id
export const findAllFollowers = (uid: string) =>
  api
    .get(`${USERS_API}/${uid}/followers`)
    .then((response) => response.data)
    .catch((err) => err.response.data);

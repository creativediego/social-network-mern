import axios from 'axios';
import { loadRequestInterceptors } from './helpers';
const BASE_URL = process.env.REACT_APP_API_URL;

const USERS_API = `${BASE_URL}/users`;

const api = axios.create();
api.interceptors.request.use(loadRequestInterceptors);
// This service exposes operations relating to the follows resource, by calling the backend Follows API

// Create a Follows object encompassing the relationship between the given users
export const followUser = (userId, followeeId) =>
  api
    .post(`${USERS_API}/${userId}/follows`, { followeeId: followeeId })
    .then((response) => response.data)
    .catch((err) => err.response.data);

// Delete the Follows object encompassing the relationship between the given users
export const unfollowUser = async (uid, followeeId) => {
  return api
    .delete(`${USERS_API}/${uid}/follows`, {
      data: { followeeId },
    })
    .then((response) => response.data)
    .catch((err) => err.response.data);
};

// Find all followers for the given user id
export const findAllFollowers = (uid) =>
  api
    .get(`${USERS_API}/${uid}/followers`)
    .then((response) => response.data)
    .catch((err) => err.response.data);

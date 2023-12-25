import { Requests, callAPI } from '../util/apiConfig';
import { config } from '../config/appConfig';
import IFollow from '../interfaces/IFollow';
import { IUser } from '../interfaces/IUser';

const USERS_API = `${config.apiURL}/users`;

// This service exposes operations relating to the follows resource, by calling the backend Follows API

// Create a Follows object encompassing the relationship between the given users
export const APIfollowUser = (userId: string, followeeId: string) =>
  callAPI<IFollow, { followeeId: string }>(
    `${USERS_API}/${userId}/follows`,
    Requests.POST,
    'Error following user. Try again later.',
    {
      followeeId,
    }
  );

// Delete the Follows object encompassing the relationship between the given users
export const APIunfollowUser = async (uid: string, followeeId: string) =>
  callAPI<IFollow, { data: string }>(
    `${USERS_API}/${uid}/follows`,
    Requests.DELETE,
    'Error unfollowing user. Try again later.',
    {
      data: followeeId,
    }
  );

// Find all followers for the given user id
export const APIfindAllFollowers = (uid: string) =>
  callAPI<IUser[]>(`${USERS_API}/${uid}/followers`, Requests.GET);

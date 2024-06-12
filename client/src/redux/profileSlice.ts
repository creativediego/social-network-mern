/**
 * This module defines the profile slice of the Redux store for managing user profiles in the application.
 *
 * The profile slice of the store uses the `createEntityAdapter` function from Redux Toolkit to generate a set of reducer functions and selectors.
 *
 * The `IUser` and `IFollow` interfaces define the shape of the user and follow data respectively.
 *
 * The `userService` and `followService` are used to interact with the user and follow APIs respectively.
 *
 * The `findProfile` async thunk fetches a user profile based on the provided username and updates the state.
 *
 * The `follow` async thunk follows a user based on the provided user ID and updates the follower count in the state.
 *
 * @module profileSlice
 * @see {@link createEntityAdapter} for the function that generates a set of reducer functions and selectors.
 * @see {@link createSlice} for the function that generates the slice.
 * @see {@link PayloadAction} for the type of all dispatched actions.
 * @see {@link createSelector} for the function that creates memoized selectors.
 * @see {@link IUser} for the type of the user data.
 * @see {@link IFollow} for the type of the follow data.
 * @see {@link userService} for the service that interacts with the user API.
 * @see {@link followService} for the service that interacts with the follow API.
 * @see {@link RootState} for the type of the root state.
 */
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IUser } from '../interfaces/IUser';
import type { RootState } from './store';
import { followService } from '../services/followService';
import { userService } from '../services/userService';

const findProfile = createAsyncThunk(
  'profile/findProfile',
  async (username: string, ThunkAPI) => {
    const user = await userService.findUserByUsername(username);
    return user;
  }
);

const follow = createAsyncThunk(
  'profile/follow-user',
  async (userId: string, thunkAPI) => {
    const followerCount = await followService.followUser(userId);
    return followerCount;
  }
);

/**
 * Async function to unfollow a user.
 * It dispatches an API call to unfollow a user by ID.
 */
const unfollow = createAsyncThunk(
  'profile/unfollow-user',
  async (userId: string, thunkAPI) => {
    const followerCount = await followService.unfollowUser(userId);
    return followerCount;
  }
);

const isFollowed = createAsyncThunk(
  'follow/isFollowed',
  async (userId: string, thunkAPI) => {
    // Fetches the list of followers of the other user
    const isFollowed = await followService.isFollowed(userId);
    return isFollowed;
  }
);

interface ProfileState {
  user: IUser;
  isFollowedByAuthUser: boolean;
  profileLoading: boolean;
  followLoading: boolean;
}

const emptyUser = {
  id: '',
  username: '',
  email: '',
  name: '',
  bio: '',
  headerImage: '',
  profilePhoto: '',
};

const initialState: ProfileState = {
  user: emptyUser,
  profileLoading: false,
  followLoading: false,
  isFollowedByAuthUser: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearProfile: (state) => {
      state.user = emptyUser;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findProfile.pending, (state) => {
      state.profileLoading = true;
    });
    builder.addCase(
      findProfile.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.profileLoading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(findProfile.rejected, (state) => {
      state.followLoading = false;
    });

    builder.addCase(isFollowed.fulfilled, (state, action) => {
      state.followLoading = false;
      state.isFollowedByAuthUser = action.payload;
    });
    builder.addCase(follow.pending, (state) => {
      state.followLoading = true;
    });
    builder.addCase(
      follow.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.followLoading = false;
        state.user.followerCount = action.payload;
        state.isFollowedByAuthUser = true;
      }
    );
    builder.addCase(follow.rejected, (state) => {
      state.followLoading = false;
    });

    // Reducers for handling unfollow action lifecycle
    builder.addCase(unfollow.pending, (state) => {
      state.followLoading = true;
    });
    builder.addCase(
      unfollow.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.followLoading = false;
        state.isFollowedByAuthUser = false;
        state.user.followerCount = action.payload;
      }
    );
  },
});

export const selectProfile = createSelector(
  (state: RootState) => state.profile.user,
  (user) => user
);

export const selectProfileLoading = createSelector(
  (state: RootState) => state.profile.profileLoading,
  (loading) => loading
);

export const selectFollowLoading = createSelector(
  (state: RootState) => state.profile.followLoading,
  (loading) => loading
);

export const selectProfileIsFollowed = createSelector(
  (state: RootState) => state.profile.isFollowedByAuthUser,
  (isFollowed) => isFollowed
);

export const { setProfileUser, clearProfile } = profileSlice.actions;

export const findProfileThunk = findProfile;
export const followThunk = follow;
export const unfollowThunk = unfollow;
export const isFollowedThunk = isFollowed;

export default profileSlice.reducer;

import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IUser } from '../interfaces/IUser';
import type { RootState } from './store';
import {
  APIfindAllFollowers,
  APIfollowUser,
  APIunfollowUser,
} from '../services/followAPI';
import IFollow from '../interfaces/IFollow';
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
  async (
    { authUserId, followeeId }: { authUserId: string; followeeId: string },
    thunkAPI
  ) => {
    return await APIfollowUser(authUserId, followeeId);
  }
);

/**
 * Async function to unfollow a user.
 * It dispatches an API call to unfollow a user by ID.
 */
const unfollow = createAsyncThunk(
  'profile/unfollow-user',
  async (
    { authUserId, followeeId }: { authUserId: string; followeeId: string },
    thunkAPI
  ) => {
    return await APIunfollowUser(authUserId, followeeId);
  }
);

const checkIfFollowed = createAsyncThunk(
  'follow/check-if-followed',
  async (otherUserId: string, thunkAPI) => {
    // Fetches the list of followers of the other user
    const otherUserFollowers = await APIfindAllFollowers(otherUserId); // Gets the authenticated user ID from the Redux store
    const state = thunkAPI.getState() as RootState;
    const authUserId = state.user.data.id; // Checks if the authenticated user is in the list of followers of the other user
    const isFollowed: boolean = otherUserFollowers.some(
      (follower) => follower.id === authUserId
    );
    return isFollowed;
  }
);

interface ProfileState {
  user: IUser;
  isFollowedByAuthUser: boolean;
  loading: boolean;
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
  loading: false,
  isFollowedByAuthUser: true,
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
      state.loading = true;
    });
    builder.addCase(
      findProfile.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(findProfile.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(checkIfFollowed.fulfilled, (state, action) => {
      state.isFollowedByAuthUser = action.payload;
    });
    builder.addCase(follow.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      follow.fulfilled,
      (state, action: PayloadAction<IFollow>) => {
        state.loading = false;
        state.user = action.payload.followee; // Updates details of the followed user
      }
    );
    builder.addCase(follow.rejected, (state) => {
      state.loading = false;
    });

    // Reducers for handling unfollow action lifecycle
    builder.addCase(unfollow.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      unfollow.fulfilled,
      (state, action: PayloadAction<IFollow>) => {
        state.loading = false;
        state.user = action.payload.followee; // Updates details of the unfollowed user
      }
    );
  },
});

export const selectProfile = createSelector(
  (state: RootState) => state.profile.user,
  (user) => user
);

export const selectProfileLoading = createSelector(
  (state: RootState) => state.profile.loading,
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

export default profileSlice.reducer;

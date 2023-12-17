import { withErrorHandling } from './errorHandler';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import { IUser } from '../interfaces/IUser';
import {
  findAllPostsDislikedByUser,
  findAllPostsLikedByUser,
} from '../services/likes-service';
import { APIfindPostsByUser } from '../services/posts-service';
import { APIfindUserByUsername } from '../services/users-service';
import type { RootState } from './store';
import {
  APIfindAllFollowers,
  APIfollowUser,
  APIunfollowUser,
} from '../services/follows-service';
import IFollow from '../interfaces/IFollow';

const findProfile = createAsyncThunk(
  'profile/findProfile',
  async (username: string, ThunkAPI) => {
    const user = await APIfindUserByUsername(username);
    ThunkAPI.dispatch(checkIfFollowed(user.id));
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

const findMyPosts = createAsyncThunk(
  'profile/findMyPosts',
  async (userId: string, ThunkAPI) => {
    const posts = await APIfindPostsByUser(userId);
    return posts;
  }
);

const findLikedPosts = createAsyncThunk(
  'profile/findMyLikes',
  async (userId: string, ThunkAPI) => {
    let posts = await findAllPostsLikedByUser(userId);
    posts = posts.filter((post: IPost) => post !== null);
    return posts;
  }
);

const findDislikedPosts = createAsyncThunk(
  'profile/findMydislikes',
  async (userId: string, ThunkAPI) => {
    let posts = await findAllPostsDislikedByUser(userId);
    posts = posts.filter((post: IPost) => post !== null);
    return posts;
  }
);

interface ProfileState {
  user: IUser;
  myPosts: EntityState<IPost>;
  likes: EntityState<IPost>;
  dislikes: EntityState<IPost>;
  isFollowedByAuthUser: boolean;
  loading: boolean;
}

const myPostsAdapter = createEntityAdapter<IPost>({
  selectId: (post: IPost) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const likedPostsAdapter = createEntityAdapter<IPost>({
  selectId: (post: IPost) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const dislikedPostsAdapter = createEntityAdapter<IPost>({
  selectId: (post: IPost) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

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
  myPosts: myPostsAdapter.getInitialState(),
  likes: likedPostsAdapter.getInitialState(),
  dislikes: dislikedPostsAdapter.getInitialState(),
  loading: false,
  isFollowedByAuthUser: true,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateMyPosts: (state, action: PayloadAction<IPost>) => {
      const existingPost = myPostsAdapter
        .getSelectors()
        .selectById(state.myPosts, action.payload.id);
      if (existingPost) {
        myPostsAdapter.upsertOne(state.myPosts, action.payload);
      }
    },
    updateLikedPosts: (state, action: PayloadAction<IPost>) => {
      const existingPost = likedPostsAdapter
        .getSelectors()
        .selectById(state.likes, action.payload.id);
      if (existingPost) {
        likedPostsAdapter.removeOne(state.likes, action.payload.id);
      } else {
        likedPostsAdapter.upsertOne(state.likes, action.payload);
      }
    },
    updateDislikedPosts: (state, action: PayloadAction<IPost>) => {
      const existingPost = dislikedPostsAdapter
        .getSelectors()
        .selectById(state.dislikes, action.payload.id);
      if (existingPost) {
        dislikedPostsAdapter.removeOne(state.dislikes, action.payload.id);
      } else {
        dislikedPostsAdapter.upsertOne(state.dislikes, action.payload);
      }
    },
    removeMyPost: (state, action: PayloadAction<IPost>) => {
      const existingPost = myPostsAdapter
        .getSelectors()
        .selectById(state.myPosts, action.payload.id);
      if (existingPost) {
        myPostsAdapter.removeOne(state.myPosts, action.payload.id);
      }
    },
    removeLikedPost: (state, action: PayloadAction<IPost>) => {
      const existingPost = likedPostsAdapter
        .getSelectors()
        .selectById(state.likes, action.payload.id);
      if (existingPost) {
        likedPostsAdapter.removeOne(state.likes, action.payload.id);
      }
    },
    removeDislikedPost: (state, action: PayloadAction<IPost>) => {
      const existingPost = dislikedPostsAdapter
        .getSelectors()
        .selectById(state.dislikes, action.payload.id);
      if (existingPost) {
        dislikedPostsAdapter.removeOne(state.dislikes, action.payload.id);
      }
    },
    setProfileUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    clearProfile: (state) => {
      state.user = emptyUser;
      myPostsAdapter.removeAll(state.likes);
      dislikedPostsAdapter.removeAll(state.dislikes);
      likedPostsAdapter.removeAll(state.likes);
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

    builder.addCase(findMyPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findMyPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;

        myPostsAdapter.setAll(state.myPosts, action.payload);
      }
    );
    builder.addCase(findMyPosts.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findLikedPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findLikedPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        likedPostsAdapter.setAll(state.likes, action.payload);
      }
    );
    builder.addCase(findLikedPosts.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findDislikedPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findDislikedPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        dislikedPostsAdapter.setAll(state.dislikes, action.payload);
      }
    );
    builder.addCase(findDislikedPosts.rejected, (state) => {
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

export const selectMyPosts = createSelector(
  (state: RootState) =>
    myPostsAdapter.getSelectors().selectAll(state.profile.myPosts),
  (posts) => posts
);

export const selectLikedPosts = createSelector(
  (state: RootState) =>
    likedPostsAdapter.getSelectors().selectAll(state.profile.likes),
  (likes) => likes
);

export const selectDislikedPosts = createSelector(
  (state: RootState) =>
    dislikedPostsAdapter.getSelectors().selectAll(state.profile.dislikes),
  (dislikes) => dislikes
);

export const selectProfileLoading = createSelector(
  (state: RootState) => state.profile.loading,
  (loading) => loading
);

export const selectProfileIsFollowed = createSelector(
  (state: RootState) => state.profile.isFollowedByAuthUser,
  (isFollowed) => isFollowed
);

export const {
  updateMyPosts,
  updateLikedPosts,
  updateDislikedPosts,
  removeMyPost,
  removeDislikedPost,
  removeLikedPost,
  setProfileUser,
  clearProfile,
} = profileSlice.actions;

export const findProfileThunk = withErrorHandling(findProfile);
export const findMyPostsThunk = withErrorHandling(findMyPosts);
export const findLikedPostsThunk = withErrorHandling(findLikedPosts);
export const findDislikedPostsThunk = withErrorHandling(findDislikedPosts);
export const followThunk = withErrorHandling(follow);
export const unfollowThunk = withErrorHandling(unfollow);

export default profileSlice.reducer;

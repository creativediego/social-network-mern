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
import { findPostsByUser } from '../services/posts-service';
import { findUserByUsername } from '../services/users-service';
import { dataOrStateError } from './helpers';
import type { RootState } from './store';

export const findProfileThunk = createAsyncThunk(
  'profile/findProfile',
  async (username: string, ThunkAPI) => {
    const user = await findUserByUsername(username);
    return dataOrStateError(user, ThunkAPI.dispatch);
  }
);

export const findMyPostsThunk = createAsyncThunk(
  'profile/findMyPosts',
  async (userId: string, ThunkAPI) => {
    const posts = await findPostsByUser(userId);
    return dataOrStateError(posts, ThunkAPI.dispatch);
  }
);

export const findLikedPostsThunk = createAsyncThunk(
  'profile/findMyLikes',
  async (userId: string, ThunkAPI) => {
    let posts = await findAllPostsLikedByUser(userId);
    posts = posts.filter((post: IPost) => post !== null);
    return dataOrStateError(posts, ThunkAPI.dispatch);
  }
);

export const findDislikedPostsThunk = createAsyncThunk(
  'profile/findMydislikes',
  async (userId: string, ThunkAPI) => {
    let posts = await findAllPostsDislikedByUser(userId);
    posts = posts.filter((post: IPost) => post !== null);
    return dataOrStateError(posts, ThunkAPI.dispatch);
  }
);

interface ProfileState {
  user: IUser | null;
  myPosts: EntityState<IPost>;
  likes: EntityState<IPost>;
  dislikes: EntityState<IPost>;
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

const initialState: ProfileState = {
  user: null,
  myPosts: myPostsAdapter.getInitialState(),
  likes: likedPostsAdapter.getInitialState(),
  dislikes: dislikedPostsAdapter.getInitialState(),
  loading: false,
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
      state.user = null;
      myPostsAdapter.removeAll(state.likes);
      dislikedPostsAdapter.removeAll(state.dislikes);
      likedPostsAdapter.removeAll(state.likes);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findProfileThunk.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(findProfileThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findMyPostsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findMyPostsThunk.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;

        myPostsAdapter.setAll(state.myPosts, action.payload);
      }
    );
    builder.addCase(findMyPostsThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findLikedPostsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findLikedPostsThunk.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        likedPostsAdapter.setAll(state.likes, action.payload);
      }
    );
    builder.addCase(findLikedPostsThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findDislikedPostsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findDislikedPostsThunk.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        dislikedPostsAdapter.setAll(state.dislikes, action.payload);
      }
    );
    builder.addCase(findDislikedPostsThunk.rejected, (state) => {
      state.loading = false;
    });
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
export default profileSlice.reducer;

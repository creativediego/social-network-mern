import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import {
  userDislikesTuit as userDislikesPost,
  userLikesTuit as userLikesPost,
} from '../services/likes-service';
import { uploadTuitImage as uploadPostImage } from '../services/storage-service';
import {
  findAllPosts as findAllPosts,
  createTuit as createPost,
  deleteTuit as deletePost,
  updateTuit as updatePost,
} from '../services/posts-service';
import { setGlobalError } from './alertSlice';
import { dataOrStateError } from './helpers';
import {
  updateDislikedTuits as updateDislikedPosts,
  updateLikedTuits as updateLikedPosts,
  updateMyTuits as updateMyPosts,
  removeDislikedTuit,
  removeLikedTuit,
  removeMyTuit,
} from './profileSlice';
import type { RootState } from './store';

/**
 * Uses posts service to update state with all posts. Also keeps track of loading status of requests.
 */
export const findAllPostsThunk = createAsyncThunk(
  'posts/findAllTuits',
  async (data, ThunkAPI) => {
    const posts = await findAllPosts();
    return dataOrStateError(posts, ThunkAPI.dispatch);
  }
);

/**
 * Uses tuit service to crate a tuit and then makes another call to fetch all posts to update state.
 */
export const createPostThunk = createAsyncThunk(
  'posts/createPost',
  async (
    {
      userId,
      post,
      imageFile,
    }: { userId: string; post: IPost; imageFile: File | null },
    ThunkAPI
  ) => {
    let resultPost = await createPost(userId, post);
    if (imageFile) {
      try {
        const postImageURL = await uploadPostImage(imageFile, resultPost.id);
        resultPost.image = postImageURL;
        resultPost = await updatePost(resultPost.id, resultPost);
      } catch (err) {
        ThunkAPI.dispatch(
          setGlobalError({
            code: 500,
            message: 'Error uploading post image. Try again later.',
          })
        );
      }
    }
    return resultPost;
  }
);

/**
 * Uses tuit service to delete a tuit and then makes another call to fetch all posts to update state.
 */
export const deletePostThunk = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, ThunkAPI) => {
    const deletedPost = await deletePost(postId);
    if (!deletedPost.error) {
      ThunkAPI.dispatch(removeTuit(postId));
      ThunkAPI.dispatch(removeMyTuit(deletedPost));
      ThunkAPI.dispatch(removeLikedTuit(deletedPost));
      ThunkAPI.dispatch(removeDislikedTuit(deletedPost));
    }
    return dataOrStateError(deletedPost, ThunkAPI.dispatch);
  }
);

export const userLikesPostThunk = createAsyncThunk(
  'posts/userLikesPost',
  async (postId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const likedPost = await userLikesPost(userId, postId);
    ThunkAPI.dispatch(updateLikedPosts(likedPost));
    ThunkAPI.dispatch(updateMyPosts(likedPost));
    return dataOrStateError(likedPost, ThunkAPI.dispatch);
  }
);

export const userDislikesPostThunk = createAsyncThunk(
  'posts/userDislikesPost',
  async (postId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const dislikedPost = await userDislikesPost(userId, postId);
    ThunkAPI.dispatch(updateDislikedPosts(dislikedPost));
    ThunkAPI.dispatch(updateMyPosts(dislikedPost));
    return dataOrStateError(dislikedPost, ThunkAPI.dispatch);
  }
);

export interface TuitsState {
  byAllUsers: IPost[];
  loading: boolean;
}

const postAdapter = createEntityAdapter<IPost>({
  selectId: (tuit: IPost) => tuit.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const postSlice = createSlice({
  name: 'posts',
  initialState: postAdapter.getInitialState({ loading: false }),
  reducers: {
    addTuit: postAdapter.upsertOne,
    removeTuit: (state, action) => {
      postAdapter.removeOne(state, action.payload);
    },
    updateTuits: (state, action) => {
      postAdapter.updateOne(state, action.payload);
    },
    removeAllTuits: (state) => {
      postAdapter.removeAll(state);
    },
    selectTuit: (state, action) => {
      postAdapter.setOne(state, action.payload);
    },
    setAllTuits: (state, action: PayloadAction<IPost[]>) => {
      postAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findAllPostsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findAllPostsThunk.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        postAdapter.setAll(state, action.payload);
      }
    );
    builder.addCase(findAllPostsThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(createPostThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createPostThunk.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(createPostThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deletePostThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePostThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deletePostThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(
      userLikesPostThunk.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(userLikesPostThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(
      userDislikesPostThunk.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(userDislikesPostThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const selectTuitsLoading = createSelector(
  (state: RootState) => state.posts.loading,
  (loading) => loading
);

export const selectAllTuits = createSelector(
  (state: RootState) => postAdapter.getSelectors().selectAll(state.posts),
  (posts) => posts
);

export const {
  removeAllTuits,
  removeTuit,
  updateTuits,
  addTuit,
  selectTuit,
  setAllTuits,
} = postSlice.actions;
export default postSlice.reducer;

import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import { userDislikesPost, userLikesPost } from '../services/likes-service';
import { uploadPostImage } from '../services/storage-service';
import {
  findAllPosts,
  createPost,
  deletePost,
  updatePost,
} from '../services/posts-service';
import { setGlobalError } from './alertSlice';
import { dataOrThrowError } from './helpers';
import {
  updateDislikedPosts,
  updateLikedPosts,
  updateMyPosts,
  removeDislikedPost,
  removeLikedPost,
  removeMyPost,
} from './profileSlice';
import type { RootState } from './store';
import { FriendlyError } from '../interfaces/IError';

/**
 * Uses posts service to update state with all posts. Also keeps track of loading status of requests.
 */
export const findAllPostsThunk = createAsyncThunk(
  'posts/findAllPosts',
  async (data, ThunkAPI) => {
    const posts = await findAllPosts();
    return dataOrThrowError(posts, ThunkAPI.dispatch);
  }
);

/**
 * Uses post service to crate a post and then makes another call to fetch all posts to update state.
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
    resultPost = dataOrThrowError(resultPost, ThunkAPI.dispatch);
    if (imageFile) {
      try {
        const postImageURL = await uploadPostImage(imageFile, resultPost.id);
        resultPost.image = postImageURL;
        resultPost = await updatePost(resultPost.id, resultPost);
      } catch (err) {
        ThunkAPI.dispatch(
          setGlobalError(new FriendlyError('Error uploading post image.'))
        );
      }
    }
    resultPost = dataOrThrowError(resultPost, ThunkAPI.dispatch);
    return resultPost;
  }
);

/**
 * Uses post service to delete a post and then makes another call to fetch all posts to update state.
 */
export const deletePostThunk = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, ThunkAPI) => {
    const deletedPost = await deletePost(postId);
    if (!deletedPost.error) {
      ThunkAPI.dispatch(removePost(postId));
      ThunkAPI.dispatch(removeMyPost(deletedPost));
      ThunkAPI.dispatch(removeLikedPost(deletedPost));
      ThunkAPI.dispatch(removeDislikedPost(deletedPost));
    }
    return dataOrThrowError(deletedPost, ThunkAPI.dispatch);
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
    return dataOrThrowError(likedPost, ThunkAPI.dispatch);
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
    return dataOrThrowError(dislikedPost, ThunkAPI.dispatch);
  }
);

export interface PostsState {
  byAllUsers: IPost[];
  loading: boolean;
}

const postAdapter = createEntityAdapter<IPost>({
  selectId: (post: IPost) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const postSlice = createSlice({
  name: 'posts',
  initialState: postAdapter.getInitialState({ loading: false }),
  reducers: {
    addPost: postAdapter.upsertOne,
    removePost: (state, action: PayloadAction<string>) => {
      postAdapter.removeOne(state, action.payload);
    },
    updatePosts: (state, action: PayloadAction<IPost>) => {
      postAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    removeAllPosts: (state) => {
      postAdapter.removeAll(state);
    },
    selectPost: (state, action) => {
      postAdapter.setOne(state, action.payload);
    },
    setAllPosts: (state, action: PayloadAction<IPost[]>) => {
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

export const selectPostsLoading = createSelector(
  (state: RootState) => state.posts.loading,
  (loading) => loading
);

export const selectAllPosts = createSelector(
  (state: RootState) => postAdapter.getSelectors().selectAll(state.posts),
  (posts) => posts
);

export const {
  removeAllPosts,
  removePost,
  updatePosts,
  addPost,
  selectPost,
  setAllPosts,
} = postSlice.actions;
export default postSlice.reducer;

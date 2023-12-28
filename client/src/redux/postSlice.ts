import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import { APIuserDislikesPost, APIuserLikesPost } from '../services/likeAPI';
import { uploadPostImage } from '../firebase/firebasestorageAPI';
import {
  APIfindAllPosts,
  APIcreatePost,
  APIdeletePost,
  APIupdatePost,
} from '../services/postAPI';
import { setGlobalError } from './alertSlice';
import {
  removeDislikedPost,
  removeLikedPost,
  removeMyPost,
  updateDislikedPosts,
  updateLikedPosts,
  updateMyPosts,
} from './profileSlice';
import type { RootState } from './store';
import { FriendlyError } from '../interfaces/IError';
import { withErrorHandling } from './reduxErrorHandler';

/**
 * Uses posts service to update state with all posts. Also keeps track of loading status of requests.
 */
const findAllPosts = createAsyncThunk(
  'posts/findAllPosts',
  async (data, ThunkAPI) => {
    const posts = await APIfindAllPosts();
    return posts;
  }
);

/**
 * Uses post service to crate a post and then makes another call to fetch all posts to update state.
 */
const createPost = createAsyncThunk(
  'posts/createPost',
  async (
    {
      userId,
      post,
      imageFile,
    }: { userId: string; post: IPost; imageFile: File | null },
    ThunkAPI
  ) => {
    let resultPost = await APIcreatePost(userId, post);
    if (imageFile) {
      try {
        const postImageURL = await uploadPostImage(imageFile, resultPost.id);
        resultPost.image = postImageURL;
        resultPost = await APIupdatePost(resultPost.id, resultPost);
      } catch (err) {
        ThunkAPI.dispatch(
          setGlobalError(new FriendlyError('Error uploading post image.'))
        );
      }
    }
    return resultPost;
  }
);

/**
 * Uses post service to delete a post and then makes another call to fetch all posts to update state.
 */
const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId: string, ThunkAPI) => {
    const deletedPost = await APIdeletePost(postId);
    ThunkAPI.dispatch(removePost(postId));
    ThunkAPI.dispatch(removeMyPost(deletedPost));
    ThunkAPI.dispatch(removeLikedPost(deletedPost));
    ThunkAPI.dispatch(removeDislikedPost(deletedPost));

    return deletedPost;
  }
);

const userLikesPost = createAsyncThunk(
  'posts/userLikesPost',
  async (postId: string, ThunkAPI) => {
    const likedPost = await APIuserLikesPost(postId);
    ThunkAPI.dispatch(updateLikedPosts(likedPost));
    ThunkAPI.dispatch(updateMyPosts(likedPost));
    return likedPost;
  }
);

const userDislikesPost = createAsyncThunk(
  'posts/userDislikesPost',
  async (postId: string, ThunkAPI) => {
    const dislikedPost = await APIuserDislikesPost(postId);
    ThunkAPI.dispatch(updateDislikedPosts(dislikedPost));
    ThunkAPI.dispatch(updateMyPosts(dislikedPost));
    return dislikedPost;
  }
);

interface PostsState {
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
    builder.addCase(findAllPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findAllPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        postAdapter.setAll(state, action.payload);
      }
    );
    builder.addCase(findAllPosts.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(createPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(createPost.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deletePost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deletePost.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deletePost.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(userLikesPost.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      userLikesPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(userLikesPost.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(
      userDislikesPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(userDislikesPost.rejected, (state) => {
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

export const findAllPostsThunk = withErrorHandling(findAllPosts);
export const createPostThunk = withErrorHandling(createPost);
export const deletePostThunk = withErrorHandling(deletePost);
export const userLikesPostThunk = withErrorHandling(userLikesPost);
export const userDislikesPostThunk = withErrorHandling(userDislikesPost);

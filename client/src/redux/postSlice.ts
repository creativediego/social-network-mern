import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import { uploadPostImage } from '../firebase/firebasestorageService';
import { postService } from '../services/postService';
import type { RootState } from './store';
import { IQueryParams } from '../interfaces/IQueryParams';

/**
 * Uses posts service to update state with all posts. Also keeps track of loading status of requests.
 */
const findAllPosts = createAsyncThunk(
  'posts/findAllPosts',
  async (queryParams: IQueryParams, ThunkAPI) => {
    const posts = await postService.findAllPosts(queryParams);
    const moreToFetch = queryParams.limit === posts.length;
    ThunkAPI.dispatch(setMoreToFetch(moreToFetch));
    return posts;
  }
);

/**
 * Uses post service to crate a post and then makes another call to fetch all posts to update state.
 */
const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ post, imageFile }: { post: IPost; imageFile: File | null }, _) => {
    let resultPost = await postService.createPost(post);
    if (imageFile) {
      const postImageURL = await uploadPostImage(imageFile, resultPost.id);
      resultPost.image = postImageURL;
      resultPost = await postService.updatePost(resultPost.id, resultPost);
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
    const deletedPost = await postService.deletePost(postId);
    return deletedPost;
  }
);

const userLikesPost = createAsyncThunk(
  'posts/userLikesPost',
  async (
    { postId, optimisticPost }: { postId: string; optimisticPost: IPost },
    ThunkAPI
  ) => {
    let rollbackPost = optimisticPost;
    try {
      ThunkAPI.dispatch(updatePosts(optimisticPost));
      const likedPost = await postService.likePost(postId);
      return likedPost;
    } catch (error) {
      ThunkAPI.dispatch(updatePosts(rollbackPost));
      throw error;
    }
  }
);

const userUnlikesPost = createAsyncThunk(
  'posts/userUnlikesPost',
  async (
    { postId, optimisticPost }: { postId: string; optimisticPost: IPost },
    ThunkAPI
  ) => {
    let rollbackPost = optimisticPost;
    try {
      ThunkAPI.dispatch(updatePosts(optimisticPost));
      const unlikedPost = await postService.unlikePost(postId);
      return unlikedPost;
    } catch (error) {
      ThunkAPI.dispatch(updatePosts(rollbackPost));
      throw error;
    }
  }
);

const findUserPosts = createAsyncThunk(
  'posts/findUserPosts',
  async (
    { userId, queryParams }: { userId: string; queryParams: IQueryParams },
    ThunkAPI
  ) => {
    const posts = await postService.findAllPostsByUser(userId, queryParams);
    const moreToFetch = queryParams.limit === posts.length;
    ThunkAPI.dispatch(setMoreToFetch(moreToFetch));
    return posts;
  }
);

const findLikedPosts = createAsyncThunk(
  'posts/findUserLikedPosts',
  async (
    { userId, queryParams }: { userId: string; queryParams: IQueryParams },
    ThunkAPI
  ) => {
    let posts = await postService.findAllPostsLikedByUser(userId, queryParams);
    const moreToFetch = queryParams.limit === posts.length;
    ThunkAPI.dispatch(setMoreToFetch(moreToFetch));
    posts = posts.filter((post: IPost) => post !== null);
    return posts;
  }
);

const postAdapter = createEntityAdapter<IPost>({
  selectId: (post: IPost) => post.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const postSlice = createSlice({
  name: 'posts',
  initialState: postAdapter.getInitialState({
    allPostsLoading: false,
    singlePostLoading: false,
    moreToFetch: false,
  }),
  reducers: {
    addPost: (state, action: PayloadAction<IPost>) => {
      postAdapter.upsertOne(state, action.payload);
    },
    removePost: (state, action: PayloadAction<string>) => {
      postAdapter.removeOne(state, action.payload);
    },
    updatePosts: (state, action: PayloadAction<IPost>) => {
      postAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    setMoreToFetch: (state, action: PayloadAction<boolean>) => {
      state.moreToFetch = action.payload;
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
      state.allPostsLoading = true;
    });
    builder.addCase(
      findAllPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.allPostsLoading = false;
        postAdapter.addMany(state, action.payload);
      }
    );
    builder.addCase(findAllPosts.rejected, (state) => {
      state.singlePostLoading = false;
      state.moreToFetch = false;
    });
    builder.addCase(createPost.pending, (state) => {
      state.singlePostLoading = true;
    });
    builder.addCase(
      createPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.singlePostLoading = false;
        postAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(createPost.rejected, (state) => {
      state.allPostsLoading = false;
    });
    builder.addCase(deletePost.pending, (state) => {
      state.allPostsLoading = true;
    });
    builder.addCase(deletePost.fulfilled, (state) => {
      state.allPostsLoading = false;
    });
    builder.addCase(deletePost.rejected, (state) => {
      state.allPostsLoading = false;
    });

    builder.addCase(userLikesPost.pending, (state) => {
      state.singlePostLoading = true;
    });
    builder.addCase(
      userLikesPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.singlePostLoading = false;
        postAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      }
    );
    builder.addCase(userLikesPost.rejected, (state) => {
      state.singlePostLoading = false;
    });

    builder.addCase(userUnlikesPost.pending, (state) => {
      state.singlePostLoading = true;
    });
    builder.addCase(
      userUnlikesPost.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.singlePostLoading = false;
        postAdapter.updateOne(state, {
          id: action.payload.id,
          changes: action.payload,
        });
      }
    );
    builder.addCase(userUnlikesPost.rejected, (state) => {
      state.singlePostLoading = false;
    });

    builder.addCase(findUserPosts.pending, (state) => {
      state.allPostsLoading = true;
    });
    builder.addCase(
      findUserPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.allPostsLoading = false;
        postAdapter.addMany(state, action.payload);
      }
    );
    builder.addCase(findUserPosts.rejected, (state) => {
      state.allPostsLoading = false;
      state.moreToFetch = false;
    });

    builder.addCase(findLikedPosts.pending, (state) => {
      state.allPostsLoading = true;
    });
    builder.addCase(
      findLikedPosts.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.allPostsLoading = false;
        postAdapter.addMany(state, action.payload);
      }
    );
    builder.addCase(findLikedPosts.rejected, (state) => {
      state.allPostsLoading = false;
    });
  },
});

export const selectPostsLoading = createSelector(
  (state: RootState) => state.posts.allPostsLoading,
  (loading) => loading
);

export const selectPostLoading = createSelector(
  (state: RootState) => state.posts.singlePostLoading,
  (loading) => loading
);

export const selectHasMorePosts = createSelector(
  (state: RootState) => state.posts.moreToFetch,
  (moreToFetch) => moreToFetch
);

export const selectAllPosts = createSelector(
  (state: RootState) => postAdapter.getSelectors().selectAll(state.posts),
  (posts) => posts
);

export const selectAllPostsByUser = createSelector(
  (state: RootState) => postAdapter.getSelectors().selectAll(state.posts),
  (state: RootState) => state.user.data, // Assuming you have a user field in your userslice
  (posts, user) => {
    if (!user.id) {
      return []; // Handle the case when user is not available
    }
    return posts.filter((post) => post.author.id === user.id);
  }
);

export const selectAllPostsLikedByUser = createSelector(
  (state: RootState) => postAdapter.getSelectors().selectAll(state.posts),
  (state: RootState) => state.user.data, // Assuming you have a user field in your userslice
  (posts, user) => {
    if (!user.id) {
      return []; // Handle the case when user is not available
    }
    return posts.filter((post) => post.likedBy.includes(user.id));
  }
);

export const {
  removeAllPosts,
  removePost,
  updatePosts,
  addPost,
  selectPost,
  setAllPosts,
  setMoreToFetch,
} = postSlice.actions;
export default postSlice.reducer;

export const findAllPostsThunk = findAllPosts;
export const createPostThunk = createPost;
export const deletePostThunk = deletePost;
export const userLikesPostThunk = userLikesPost;
export const userUnlikesPostThunk = userUnlikesPost;
export const findUserPostsThunk = findUserPosts;
export const findLikedPostsThunk = findLikedPosts;

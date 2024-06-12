/**
 * This module defines the post slice of the Redux store for managing posts in the application.
 *
 * The post slice of the store uses the `createEntityAdapter` function from Redux Toolkit to generate a set of reducer functions and selectors.
 *
 * The `IPost` and `IQueryParams` interfaces define the shape of the post data and query parameters respectively.
 *
 * The `postService` is used to interact with the post API.
 *
 * The `uploadPostImage` function is used to upload post images to Firebase storage.
 *
 * The `findAllPosts` async thunk fetches all posts based on the provided query parameters and updates the state.
 *
 * The `findTopPostsByLikes` async thunk fetches the top posts sorted by likes.
 *
 * @module postSlice
 * @see {@link createEntityAdapter} for the function that generates a set of reducer functions and selectors.
 * @see {@link createSlice} for the function that generates the slice.
 * @see {@link PayloadAction} for the type of all dispatched actions.
 * @see {@link createSelector} for the function that creates memoized selectors.
 * @see {@link IPost} for the type of the post data.
 * @see {@link IQueryParams} for the type of the query parameters.
 * @see {@link postService} for the service that interacts with the post API.
 * @see {@link uploadPostImage} for the function that uploads post images to Firebase storage.
 * @see {@link RootState} for the type of the root state.
 */
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

const findTopPostsByLikes = createAsyncThunk(
  'posts/findTopPostsByLikes',
  async (queryParams: IQueryParams, ThunkAPI) => {
    const posts = await postService.findTopPostsByLikes(queryParams);
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
    topPostsLoading: false,
    moreToFetch: false,
    topPosts: [] as IPost[],
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

    builder.addCase(findTopPostsByLikes.pending, (state) => {
      state.topPostsLoading = true;
    });
    builder.addCase(
      findTopPostsByLikes.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.topPostsLoading = false;
        state.topPosts = action.payload;
      }
    );
    builder.addCase(findTopPostsByLikes.rejected, (state) => {
      state.topPostsLoading = false;
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

    builder.addCase(userLikesPost.pending, (state) => {});
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

    builder.addCase(userUnlikesPost.pending, (state) => {});
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

export const selectTopPostsLoading = createSelector(
  (state: RootState) => state.posts.topPostsLoading,
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

export const selectTopPosts = createSelector(
  (state: RootState) => state.posts.topPosts,
  (topPosts) => topPosts
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
export const findTopPostsByLikesThunk = findTopPostsByLikes;

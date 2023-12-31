import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { urlConfig } from '../config/appConfig';
import { IPost } from '../interfaces/IPost';
import { AppDispatch } from './store';
import { setGlobalError } from './alertSlice';

// For handling the Post API. Posts should be ordered by date from most recent to least recent.
export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: fetchBaseQuery({
    baseUrl: urlConfig.postApi,
    prepareHeaders: (headers, { getState }) => {
      // Get the token from localStorage or any other source
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      // You can add other headers if needed
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),

  endpoints: (builder) => ({
    findAllPosts: builder.query<IPost[], void>({
      query: () => ({
        url: '/',
        method: 'GET',
        // Define your API endpoint for fetching and sorting posts by date
        // Adjust the property names according to your API response structure
        transformResponse: (response: IPost[]) =>
          response.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
      }),
    }),
    findAllPostsByKeyword: builder.query<IPost[], string>({
      query: (keyword) => `/search/${keyword}`,
    }),
    findAllPostsByUser: builder.query<IPost[], string>({
      query: (userId) => `/users/${userId}`,
    }),
    createPost: builder.mutation<IPost, IPost>({
      query: (post) => ({
        url: `/posts`,
        method: 'POST',
        body: post,
      }),
    }),
    updatePost: builder.mutation<IPost, IPost>({
      query: (post) => ({
        url: `/${post.id}`,
        method: 'PUT',
        body: post,
      }),
    }),
    deletePost: builder.mutation<IPost, string>({
      query: (postId) => ({
        url: `/${postId}`,
        method: 'DELETE',
      }),
    }),
    likePost: builder.mutation<IPost, string>({
      query: (postId) => ({
        url: `/${postId}/likes`,
        method: 'POST',
      }),
    }),
    dislikePost: builder.mutation<IPost, string>({
      query: (postId) => ({
        url: `/${postId}/dislikes`,
        method: 'POST',
      }),
    }),
    findAllPostsLikedByUser: builder.query<IPost[], string>({
      query: (userId) => `/likes/users/${userId}`,
    }),
    findAllPostsDislikedByUser: builder.query<IPost[], string>({
      query: (userId) => `/dislikes/users/${userId}`,
    }),
  }),
});

export const {
  useFindAllPostsQuery,
  useLikePostMutation,
  useCreatePostMutation,
} = postApi;

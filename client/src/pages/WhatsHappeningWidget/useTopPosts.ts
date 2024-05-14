import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  selectTopPosts,
  selectTopPostsLoading,
  findTopPostsByLikesThunk,
} from '../../redux/postSlice';
import { IQueryParams } from '../../interfaces/IQueryParams';

export const useTopPosts = (limit?: number) => {
  const posts = useAppSelector(selectTopPosts);
  const loading = useAppSelector(selectTopPostsLoading);
  const dispatch = useAppDispatch();
  const queryParams: IQueryParams = { page: 2, limit: limit || 5 };
  useEffect(() => {
    dispatch(findTopPostsByLikesThunk(queryParams));
  }, []);

  return { posts, loading };
};

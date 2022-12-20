import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  findMyPostsThunk,
  findLikedPostsThunk,
  findDislikedPostsThunk,
  selectMyPosts,
  selectLikedPosts,
  selectDislikedPosts,
  selectProfileLoading,
} from '../../../redux/profileSlice';
export const useProfilePosts = (userId: string) => {
  const dispatch = useAppDispatch();
  const myPosts = useAppSelector(selectMyPosts);
  const likedPosts = useAppSelector(selectLikedPosts);
  const dislikedPosts = useAppSelector(selectDislikedPosts);
  const loading = useAppSelector(selectProfileLoading);

  useEffect(() => {
    dispatch(findMyPostsThunk(userId));
    dispatch(findLikedPostsThunk(userId));
    dispatch(findDislikedPostsThunk(userId));
  }, [dispatch, userId]);

  return { myPosts, likedPosts, dislikedPosts, loading };
};

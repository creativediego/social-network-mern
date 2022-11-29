import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  findMyTuitsThunk,
  findLikedTuitsThunk,
  findDislikedTuitsThunk,
  selectMyTuits,
  selectLikedTuits,
  selectDislikedTuits,
  selectProfileLoading,
} from '../../../redux/profileSlice';
export const useProfileTuits = (userId: string) => {
  const dispatch = useAppDispatch();
  const myTuits = useAppSelector(selectMyTuits);
  const likedTuits = useAppSelector(selectLikedTuits);
  const dislikedTuits = useAppSelector(selectDislikedTuits);
  const loading = useAppSelector(selectProfileLoading);

  useEffect(() => {
    dispatch(findMyTuitsThunk(userId));
    dispatch(findLikedTuitsThunk(userId));
    dispatch(findDislikedTuitsThunk(userId));
  }, [dispatch, userId]);

  return { myTuits, likedTuits, dislikedTuits, loading };
};

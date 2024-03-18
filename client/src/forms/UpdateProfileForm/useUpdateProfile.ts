import { useCallback } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { IUser } from '../../interfaces/IUser';
import { updateUserThunk } from '../../redux/userSlice';

export const useUpdateProfile = () => {
  const dispatch = useAppDispatch();

  const updateProfile = useCallback(
    (user: IUser, profilePhoto: File | null, headerImage: File | null) => {
      dispatch(updateUserThunk({ user, profilePhoto, headerImage }));
    },
    [dispatch]
  );

  return {
    updateProfile,
  };
};

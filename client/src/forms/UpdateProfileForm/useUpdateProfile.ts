import { useCallback } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { IUser } from '../../interfaces/IUser';
import { updateUserThunk } from '../../redux/userSlice';

/**
 * `useUpdateProfile` is a custom hook that provides a function to update the user's profile.
 * It uses the `useAppDispatch` hook to get the dispatch function from the Redux store.
 * The `updateProfile` function is memoized with the `useCallback` hook and dispatches the `updateUserThunk` action to the Redux store.
 * The `updateProfile` function takes in `user`, `profilePhoto`, and `headerImage` as arguments.
 * The `user` object is the new user data to update.
 * The `profilePhoto` and `headerImage` files are the new profile photo and header image to upload.
 *
 * @returns {Object} The `updateProfile` function.
 *
 * @example
 * const { updateProfile } = useUpdateProfile();
 * updateProfile(user, profilePhoto, headerImage);
 *
 * @see {@link useAppDispatch} for the hook that gets the dispatch function from the Redux store.
 * @see {@link useCallback} for the hook that memoizes the `updateProfile` function.
 * @see {@link updateUserThunk} for the action that updates the user's profile.
 */
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

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  registerThunk,
  selectAuthUserLoading,
  selectIsLoggedIn,
  selectCompletedSignup,
  selectIsVerified,
  verifyEmailThunk,
  registerWithGoogleThunk,
} from '../../redux/userSlice';
import { SignupSchemaT, SignupSchema } from '../../types/SignupSchema';
import { useCallback, useState } from 'react';

/**
 * `useSignUpForm` is a custom hook that manages the state and behavior of the sign up form.
 * It uses several selectors from the `userSlice` to get the current user state from the Redux store.
 * It also uses the `useForm` hook from React Hook Form with a Zod schema for form validation.
 * The hook returns several values and functions that can be used to interact with the form and the user state.
 *
 * @returns {Object} The state and functions related to the sign up form.
 * @property {boolean} isLoggedIn - Whether the user is logged in.
 * @property {boolean} isVerified - Whether the user's email is verified.
 * @property {boolean} verificationResent - Whether the verification email has been resent.
 * @property {boolean} completedSignup - Whether the user has completed the sign up process.
 * @property {boolean} loading - Whether the user state is being loaded.
 * @property {UseFormReturn<SignupSchemaT>} formMethods - The methods returned by the `useForm` hook.
 * @property {() => void} onSubmit - The function to call when the form is submitted.
 *
 * @example
 * const { isLoggedIn, isVerified, verificationResent, completedSignup, loading, formMethods, onSubmit } = useSignUpForm();
 *
 * @see {@link useAppSelector} for the hook that selects state from the Redux store.
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
 * @see {@link useForm} for the hook that manages the form state.
 * @see {@link zodResolver} for the function that resolves the Zod schema.
 * @see {@link useCallback} for the hook that memoizes the `onSubmit` function.
 */

export const useSignUpForm = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const isVerified = useAppSelector(selectIsVerified);
  const [verificationResent, setVerificationResent] = useState(false);
  const completedSignup = useAppSelector(selectCompletedSignup);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthUserLoading);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupSchemaT>({
    resolver: zodResolver(SignupSchema),
    mode: 'onBlur',
  });

  const onSubmit = useCallback(
    async (data: SignupSchemaT) => {
      dispatch(
        registerThunk({
          email: data.email,
          password: data.password,
          name: data.name,
          username: data.username,
        })
      );
    },
    [dispatch]
  );

  const registerWithEmail = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      handleSubmit(onSubmit)();
    },
    [handleSubmit, onSubmit]
  );

  const registerWithGoogle = useCallback(() => {
    dispatch(registerWithGoogleThunk());
  }, [dispatch]);

  const sendVerificationEmail = useCallback(async () => {
    if (verificationResent) return;
    dispatch(verifyEmailThunk());
    setVerificationResent(true);
  }, [dispatch, verificationResent]);

  return {
    isLoggedIn,
    isVerified,
    verificationResent,
    completedSignup,
    loading,
    registerWithEmail,
    registerWithGoogle,
    sendVerificationEmail,
    register,
    errors,
  };
};

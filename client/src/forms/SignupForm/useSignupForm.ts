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
import { useCallback, useEffect, useState } from 'react';
import { firebaseSendVerificationEmail } from '../../firebase/firebaseAuthService';

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

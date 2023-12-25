import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  registerThunk,
  selectAuthUserLoading,
  selectIsLoggedIn,
  selectIsProfileComplete,
} from '../../redux/userSlice';
import { SignupSchemaT, SignupSchema } from '../../types/SignupSchema';

export const useSignUpForm = () => {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const profileComplete = useAppSelector(selectIsProfileComplete);
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

  const onSubmit = async (data: SignupSchemaT) => {
    dispatch(registerThunk({ email: data.email, password: data.password }));
  };

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();
    handleSubmit(onSubmit)();
  };
  return {
    completeSignup: !profileComplete && isLoggedIn,
    loading,
    submitForm,
    register,
    errors,
  };
};

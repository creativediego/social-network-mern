import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { registerThunk, selectAuthUserLoading } from '../../redux/userSlice';
import { ReactHookFormInput } from '../';
import { SignupSchemaT, SignupSchema } from '../../types/SignupSchema';
import { ActionButton } from '../../components';

const SignupForm = (): JSX.Element => {
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
    // Set timeout to mock api call delay
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    dispatch(registerThunk({ email: data.email, password: data.password }));
    // Here you can perform actions with the form data, like sending it to a server
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className='form-container'>
        <ReactHookFormInput
          label='Email'
          id='email'
          type='email'
          register={register('email')}
          error={errors}
        />
        <ReactHookFormInput
          label='Password'
          id='password'
          type='password'
          register={register('password')}
          error={errors}
        />
        <ReactHookFormInput
          label='Confirm Password'
          id='confirmPassword'
          type='password'
          register={register('confirmPassword')}
          error={errors}
        />
        <ActionButton position={'right'} loading={loading} />
      </form>
    </>
  );
};

export default SignupForm;

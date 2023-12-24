import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  registerThunk,
  selectAuthUserLoading,
  selectIsProfileComplete,
  updateUserThunk,
} from '../../redux/userSlice';
import { ReactHookFormInput } from '../';
import {
  UpdateProfileSchemaT,
  UpdateProfileSchema,
} from '../../types/UpdateProfileSchema';
import { SignupSchema } from '../../types/SignupSchema';
import { useAuthUser } from '../../hooks/useAuthUser';
import {
  ActionButton,
  AvatarUpload,
  HeaderImageUpload,
} from '../../components';
import { IUser } from '../../interfaces/IUser';

interface UpdateProfileFormProps {
  user: IUser;
}

const UpdateProfileForm = ({ user }: UpdateProfileFormProps): JSX.Element => {
  const profileComplete = useAppSelector(selectIsProfileComplete);
  const loading = useAppSelector(selectAuthUserLoading);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateProfileSchemaT>({
    resolver: zodResolver(UpdateProfileSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: UpdateProfileSchemaT) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    dispatch(
      updateUserThunk({
        ...user,
        username: data.username,
        name: data.name,
        bio: data.bio,
        email: data.email,
        password: data.password,
      })
    );
  };

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('username', user.username);
      setValue('bio', user.bio);
      setValue('email', user.email);
    }
  }, []);

  return (
    <>
      <div className='mb-5 position-relative bg-white'>
        <div>
          <HeaderImageUpload user={user} />
          <AvatarUpload user={user} />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='form-container'>
        <>
          <ReactHookFormInput
            label='Name'
            id='name'
            type='name'
            register={register('name')}
            error={errors}
          />
          <ReactHookFormInput
            label='Username'
            id='username'
            type='username'
            register={register('username')}
            error={errors}
          />
          <ReactHookFormInput
            label='Bio'
            id='bio'
            type='bio'
            register={register('bio')}
            error={errors}
          />

          <ReactHookFormInput
            label='Email'
            id='email'
            type='email'
            register={register('email')}
            error={errors}
            disabled={user.registeredWithProvider}
          />
          <ReactHookFormInput
            label='Password'
            id='password'
            type='password'
            register={register('password')}
            error={errors}
            disabled={user.registeredWithProvider || !profileComplete}
          />
          <ReactHookFormInput
            label='Confirm Password'
            id='confirmPassword'
            type='password'
            register={register('confirmPassword')}
            error={errors}
            disabled={user.registeredWithProvider || !profileComplete}
          />
        </>
        <ActionButton position={'right'} loading={loading} />
      </form>
    </>
  );
};

export default UpdateProfileForm;

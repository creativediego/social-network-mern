import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReactHookFormInput } from '../';
import {
  UpdateProfileSchemaT,
  UpdateProfileSchema,
} from '../../types/UpdateProfileSchema';
import {
  ActionButton,
  AvatarUpload,
  HeaderImageUpload,
} from '../../components';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useUpdateProfile } from './useUpdateProfile';
import { useUploadFile } from '../../hooks/useUploadFile';

const UpdateProfileForm = (): JSX.Element => {
  const { user, completedSignup, loading } = useAuthUser();
  const { updateProfile } = useUpdateProfile();
  const {
    filePreview: avatarPreview,
    file: avatarFile,
    handleImageChange: handleAvatarImageChange,
  } = useUploadFile();
  const {
    filePreview: headerImagePreview,
    file: headerImageFile,
    handleImageChange: handleHeaderImageChange,
  } = useUploadFile();

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
    updateProfile(
      {
        ...user,
        username: data.username,
        name: data.name,
        bio: data.bio || '',
        email: data.email,
        password: data.password,
      },
      avatarFile,
      headerImageFile
    );
  };
  console.log(user);
  const isFirstRun = useRef(true); // ensures that existing user data is only set once
  useEffect(() => {
    if (!isFirstRun.current) {
      return;
    }
    // Set the form values to existing user data
    if (user) {
      setValue('name', user.name);
      setValue('username', user.username);
      setValue('bio', user.bio);
      setValue('email', user.email);

      isFirstRun.current = false;
    }
  }, [setValue, user, isFirstRun]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='form-container'>
      <div className='mb-5 position-relative bg-white'>
        <div>
          <HeaderImageUpload
            user={user}
            imagePreview={headerImagePreview}
            register={register('headerImage')}
            handleChange={handleHeaderImageChange}
          />
          <AvatarUpload
            user={user}
            imagePreview={avatarPreview}
            handleChange={handleAvatarImageChange}
            register={register('profilePhoto')}
          />
        </div>
      </div>

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
        disabled={user.username !== undefined && user.username !== ''}
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
        hide={user.registeredWithProvider || !completedSignup}
      />
      <ReactHookFormInput
        label='Confirm Password'
        id='confirmPassword'
        type='password'
        register={register('confirmPassword')}
        error={errors}
        hide={user.registeredWithProvider || !completedSignup}
      />
      <ReactHookFormInput
        label='Bio'
        id='bio'
        type='bio'
        register={register('bio')}
        placeholder='(optional)'
        error={errors}
      />
      <ActionButton position={'right'} loading={loading} />
      {errors.profilePhoto && (
        <div className='alert alert-danger'>{`${errors.profilePhoto.message}`}</div>
      )}
    </form>
  );
};

export default UpdateProfileForm;

import React, { memo, useEffect } from 'react';
import './AvatarUpload.scss';
import { Loader } from '../../components';
import { StoragePaths } from '../../interfaces/ImageTypes';
import { IUser } from '../../interfaces/IUser';
import { useUploadFile } from '../../hooks/useUploadFile';
import { useUpdateProfile } from './useUpdateProfile';
import { UseFormRegisterReturn } from 'react-hook-form';
import { ImageUploadProps } from './AvatarUpload';

/**
 * Displays user's background header image. Handles state upload via props.
 */

const HeaderImageUpload = ({
  user,
  imagePreview,
  children,
}: ImageUploadProps) => {
  const imageURL = imagePreview || user.headerImage;

  return (
    <div
      className='d-flex flex-column header-image-container bg-dark d-flex justify-content-center align-items-center'
      style={{
        backgroundImage: imageURL ? `url(${imageURL})` : 'none',
        backgroundSize: 'cover',
      }}
    >
      <label
        htmlFor='headerImage'
        className='position-relative bg-white d-flex align-items-center justify-content-center'
      >
        <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
          <i className='fa-solid fa-camera'></i>
        </div>
      </label>
      {children}
    </div>
  );
};

export default memo(HeaderImageUpload);

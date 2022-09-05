import React, { memo } from 'react';
import './AvatarUpload.scss';
import { Loader } from '../../components';
import { ProfileImageProps } from './AvatarUpload';
import { ImageTypes } from '../../interfaces/ImageTypes';

/**
 * Displays user's background header image. Handles state upload via props.
 */
const HeaderImageUpload = ({
  imageURL,
  uploadImage,
  loading,
}: ProfileImageProps) => {
  return (
    <div
      className='d-flex flex-column header-image-container bg-dark d-flex justify-content-center align-items-center'
      style={{
        backgroundImage: `url('${imageURL})`,
        backgroundSize: 'cover',
      }}
    >
      {loading ? (
        <Loader loading={loading} color='black' />
      ) : (
        <label
          htmlFor='headerImage'
          className='position-relative bg-white d-flex align-items-center justify-content-center'
        >
          <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
            <i className='fa-solid fa-camera'></i>
          </div>
        </label>
      )}
      <input
        onChange={(e: React.FormEvent<HTMLInputElement>) => {
          if (e.currentTarget.files) {
            uploadImage(e.currentTarget.files.item(0), ImageTypes.HEADER);
          }
        }}
        className='avatar-input'
        type='file'
        id='headerImage'
      />
    </div>
  );
};

export default memo(HeaderImageUpload);

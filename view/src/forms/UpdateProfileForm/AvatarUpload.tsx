import React, { memo } from 'react';
import { Loader } from '../../components';
import { AvatarImage } from '../../components';
import './AvatarUpload.scss';
import { IUser } from '../../interfaces/IUser';
import { ImageTypes } from '../../interfaces/ImageTypes';

/**
 * Displays user's profile photo and upload functionality. Handles upload via props function.
 */
export interface ProfileImageProps {
  imageURL: string;
  uploadImage: (file: File | null, imageType: ImageTypes) => void;
  loading?: boolean;
}

const AvatarUpload = ({
  imageURL,
  uploadImage,
  loading,
}: ProfileImageProps): JSX.Element => {
  return (
    <div className='left-0 position-absolute avatar-container  '>
      <div className='position-relative justify-content-center align-items-center d-flex'>
        <div className='ratio ratio-1x1 rounded-circle overflow-hidden  d-flex align-items-center'>
          <label
            htmlFor='avatar'
            className='position-relative  d-flex align-items-center justify-content-center'
          >
            {loading ? (
              <div className='position-absolute'>
                <Loader loading={loading} size='fs-3' color='black' />
              </div>
            ) : (
              <div className='d-flex align-items-center justify-content-center'>
                <AvatarImage profilePhoto={imageURL} size={150} />
                <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
                  <i className='fa-solid fa-camera'></i>
                </div>
              </div>
            )}
          </label>

          <input
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              if (e.currentTarget.files) {
                uploadImage(
                  e.currentTarget.files.item(0),
                  ImageTypes.PROFILE_PHOTO
                );
              }
            }}
            className='avatar-input'
            type='file'
            id='avatar'
          />
        </div>
      </div>
    </div>
  );
};

export default memo(AvatarUpload);

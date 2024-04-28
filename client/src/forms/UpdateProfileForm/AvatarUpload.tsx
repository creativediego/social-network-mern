import React, { memo } from 'react';
import { AvatarImage } from '../../components';
import './AvatarUpload.scss';
import { IUser } from '../../interfaces/IUser';

export interface ImageUploadProps {
  imagePreview: string | undefined;
  user: IUser;
  children: React.ReactElement<HTMLInputElement>;
}

/**
 * Displays user's profile photo and upload functionality. Handles upload via props function.
 */

const AvatarUpload = ({
  imagePreview,
  user,
  children,
}: ImageUploadProps): JSX.Element => {
  const avatar = imagePreview || user.profilePhoto;
  return (
    <div className='left-0 position-absolute avatar-container  '>
      <div className='position-relative justify-content-center align-items-center d-flex'>
        <div className='ratio ratio-1x1 rounded-circle overflow-hidden  d-flex align-items-center'>
          <label
            htmlFor='profilePhoto'
            className='position-relative  d-flex align-items-center justify-content-center'
          >
            <div></div>
            <div className='d-flex align-items-center justify-content-center'>
              <AvatarImage profilePhoto={avatar} size={150} />
              <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
                <i className='fa-solid fa-camera'></i>
              </div>
            </div>
          </label>
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(AvatarUpload);

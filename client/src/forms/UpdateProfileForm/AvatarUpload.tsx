import React, { memo, useEffect } from 'react';
import { Loader } from '../../components';
import { AvatarImage } from '../../components';
import './AvatarUpload.scss';
import { StoragePaths } from '../../interfaces/ImageTypes';
import { useUploadFile } from '../../hooks/useUploadFile';
import { IUser } from '../../interfaces/IUser';
import { setAuthUser } from '../../redux/userSlice';
import { useAppDispatch } from '../../redux/hooks';

/**
 * Displays user's profile photo and upload functionality. Handles upload via props function.
 */

interface AvatarUploadProps {
  user: IUser;
}

const AvatarUpload = ({ user }: AvatarUploadProps): JSX.Element => {
  const { loading, uploadFile, fileURL } = useUploadFile(StoragePaths.AVATAR);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthUser({ ...user, profilePhoto: fileURL }));
  }, [fileURL]);

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
                <AvatarImage profilePhoto={user.profilePhoto} size={150} />
                <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
                  <i className='fa-solid fa-camera'></i>
                </div>
              </div>
            )}
          </label>

          <input
            onChange={(e: React.FormEvent<HTMLInputElement>) => {
              if (e.currentTarget.files) {
                uploadFile(e.currentTarget.files.item(0), `avatar-${user.id}`);
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

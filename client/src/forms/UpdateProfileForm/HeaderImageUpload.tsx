import React, { memo, useEffect } from 'react';
import './AvatarUpload.scss';
import { Loader } from '../../components';
import { ImageTypes, StoragePaths } from '../../interfaces/ImageTypes';
import { IUser } from '../../interfaces/IUser';
import { useUploadFile } from '../../hooks/useUploadFile';
import { useAppDispatch } from '../../redux/hooks';
import { setAuthUser } from '../../redux/userSlice';

/**
 * Displays user's background header image. Handles state upload via props.
 */
interface HeaderImageUploadProps {
  user: IUser;
}
const BackgroundImageUpload = ({ user }: HeaderImageUploadProps) => {
  const { loading, uploadFile, fileURL } = useUploadFile(
    StoragePaths.BACKGROUND
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthUser({ ...user, headerImage: fileURL }));
  }, [fileURL]);

  return (
    <div
      className='d-flex flex-column header-image-container bg-dark d-flex justify-content-center align-items-center'
      style={{
        backgroundImage: `url('${user.headerImage})`,
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
            uploadFile(e.currentTarget.files.item(0), `background-${user.id}`);
          }
        }}
        className='avatar-input'
        type='file'
        id='headerImage'
      />
    </div>
  );
};

export default memo(BackgroundImageUpload);

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Loader } from '../../components';
import { setGlobalError } from '../../redux/errorSlice';
import {
  uploadAvatar,
  uploadHeaderImage,
} from '../../services/storage-service';
import { AvatarImage } from '../../components';
import './AvatarUpload.css';

const AvatarUpload = ({ profileValues, setProfileValues }) => {
  const dispatch = useDispatch();
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [headerLoading, setHeaderLoading] = useState(false);
  const authUser = profileValues;
  const [avatarFile, setAvatarFile] = useState(undefined);
  const [headerImageFile, setHeaderImageFile] = useState(undefined);

  const handleUploadAvatar = async () => {
    if (!avatarFile) return;
    setAvatarLoading(true);
    try {
      const avatarURL = await uploadAvatar(avatarFile);
      setProfileValues({ ...profileValues, profilePhoto: avatarURL });
      setAvatarLoading(false);
    } catch (err) {
      const message =
        'Sorry, we ran into an error uploading your profile avatar. Login again, or try again later.';
      dispatch(setGlobalError({ error: message }));
    }
  };

  const handleUploadHeaderImage = async () => {
    if (!headerImageFile) return;
    setHeaderLoading(true);
    try {
      const headerImageURL = await uploadHeaderImage(headerImageFile);
      setProfileValues({ ...profileValues, headerImage: headerImageURL });
      setHeaderLoading(false);
    } catch (err) {
      const message =
        'Sorry, we ran into an error uploading your profile background photo. Try again later.';
      dispatch(setGlobalError({ error: message }));
    }
  };

  useEffect(() => {
    handleUploadAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarFile]);

  useEffect(() => {
    handleUploadHeaderImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerImageFile]);

  return (
    <div>
      {authUser && (
        <div className='mb-5 position-relative bg-white'>
          <div
            className='d-flex flex-column header-image-container bg-dark d-flex justify-content-center align-items-center'
            style={{
              backgroundImage: `url('${authUser.headerImage})`,
              backgroundSize: 'cover',
            }}
          >
            {headerLoading ? (
              <Loader loading={headerLoading} />
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
              onChange={(e) => {
                setHeaderImageFile(e.target.files[0]);
              }}
              className='avatar-input'
              type='file'
              id='headerImage'
            />
            {/* <img src={authUser.headerImage} alt='profile header' /> */}
          </div>
          <div className='left-0 position-absolute avatar-container  '>
            <div className='position-relative '>
              <div className='ratio ratio-1x1 rounded-circle overflow-hidden  d-flex align-items-center'>
                <label
                  htmlFor='avatar'
                  className='position-relative  d-flex align-items-center justify-content-center'
                >
                  {avatarLoading ? (
                    <div className='position-absolute'>
                      <Loader loading={avatarLoading} size='fs-3' />
                    </div>
                  ) : (
                    <div className='d-flex align-items-center justify-content-center'>
                      <AvatarImage
                        profilePhoto={authUser.profilePhoto}
                        size={150}
                      />
                      <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
                        <i className='fa-solid fa-camera'></i>
                      </div>
                    </div>
                  )}
                </label>

                <input
                  onChange={(e) => {
                    setAvatarFile(e.target.files[0]);
                  }}
                  className='avatar-input'
                  type='file'
                  id='avatar'
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;

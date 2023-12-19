import React, { memo } from 'react';
import LogoutButton from '../LogoutButton/LogoutButton';
import { AvatarImage } from '../../AvatarImage/AvatarImage';
import { UpdateProfileForm } from '../../../forms';
import useToggleBoolean from '../../../hooks/useToggleBoolean';
import PopupModal from '../../PopupModal/PopupModal';
import FollowButton from '../../FollowButton/FollowButton';
import { IUser } from '../../../interfaces/IUser';

interface ProfileInfoProps {
  profileUser: IUser;
  isAuthUser: boolean;
  loading: boolean;
}

const ProfileInfo = ({
  profileUser,
  isAuthUser,
  loading,
}: ProfileInfoProps) => {
  const [showEditProfile, setShowEditProfile] = useToggleBoolean(false);
  return (
    <>
      {profileUser && !loading && (
        <>
          <h5 className='p-2 mb-0 pb-0 fw-bolder'>
            {profileUser.name || profileUser.firstName}
            <i className='fa fa-badge-check text-primary'></i>
          </h5>
          {/* <span className='ps-2'>{user.postCount} Posts</span> */}
          <div
            className='mb-5 position-relative bg-primary'
            style={{
              backgroundImage: `url('${profileUser.headerImage})`,
              backgroundSize: 'cover',
              height: '200px',
            }}
          >
            <div className='bottom-0 top-50 left-0  position-absolute rounded-circle'>
              <AvatarImage profilePhoto={profileUser.profilePhoto} size={150} />
            </div>
            {isAuthUser && (
              <span>
                <LogoutButton />
                <button
                  onClick={setShowEditProfile}
                  className='mt-2 me-2 btn btn-large btn-light border border-secondary fw-bolder rounded-pill fa-pull-right'
                >
                  Edit profile
                </button>
                <PopupModal
                  title='Update Profile'
                  show={showEditProfile}
                  setShow={setShowEditProfile}
                  size='lg'
                  closeButton={true}
                >
                  <UpdateProfileForm
                    showOptional={true}
                    submitCallBack={setShowEditProfile}
                    fields={[
                      'name',
                      'username',
                      'bio',
                      'email',
                      'password',
                      'confirmPassword',
                    ]}
                  />
                </PopupModal>
              </span>
            )}
          </div>

          <div className='p-2'>
            <h5 className='fw-bolder pb-0 mb-0'>
              {profileUser.name || profileUser.firstName}
              <i className='fa fa-badge-check text-primary'></i>
            </h5>
            <h6 className='pt-0'>{`@${profileUser.username}`}</h6>
            <p className='pt-2'>{profileUser.bio}</p>
            <b>{profileUser ? profileUser.followeeCount : 0}</b> Following
            <b className='ms-4'>
              {profileUser ? profileUser.followerCount : 0}
            </b>{' '}
            Followers
            {!isAuthUser && <FollowButton userId={profileUser.name} />}
          </div>
        </>
      )}
    </>
  );
};

export default memo(ProfileInfo);

import { memo } from 'react';
import LogoutButton from '../LogoutButton/LogoutButton';
import { AvatarImage } from '../../../components';
import { UpdateProfileForm } from '../../../forms';
import useToggle from '../../../hooks/useToggle';
import PopupModal from '../../PopupModal/PopupModal';
import FollowButton from '../../FollowButton/FollowButton';
import { IUser } from '../../../interfaces/IUser';

/**
 * `ProfileInfoProps` is an interface that defines the properties for the `ProfileInfo` component.
 *
 * @interface
 * @property {IUser} profileUser - The user whose profile is being displayed. This is a required property.
 * @property {boolean} isAuthUser - A boolean indicating whether the profile user is the authenticated user. This is a required property.
 * @property {boolean} loading - A boolean indicating whether the profile data is loading. This is a required property.
 */
interface ProfileInfoProps {
  profileUser: IUser;
  isAuthUser: boolean;
  loading: boolean;
}

/**
 * `ProfileInfo` is a component that displays the profile information of a user.
 *
 * It uses the `useToggleBoolean` hook to manage the visibility of the edit profile modal.
 *
 * @component
 * @example
 * Example usage of ProfileInfo component
 * <ProfileInfo profileUser={user} isAuthUser={true} loading={false} />
 *
 * @param {ProfileInfoProps} props - The properties that define the profile information.
 * @param {IUser} props.profileUser - The user whose profile is being displayed.
 * @param {boolean} props.isAuthUser - A boolean indicating whether the profile user is the authenticated user.
 * @param {boolean} props.loading - A boolean indicating whether the profile data is loading.
 *
 * @returns {JSX.Element} A JSX element representing the profile information.
 */
const ProfileInfo = ({
  profileUser,
  isAuthUser,
  loading,
}: ProfileInfoProps): JSX.Element => {
  const [showEditProfile, setShowEditProfile] = useToggle(false);
  return (
    <>
      {profileUser && !loading && (
        <>
          <h5 className='p-2 mb-0 pb-0 fw-bolder'>
            {profileUser.name}
            <i className='fa fa-badge-check text-primary'></i>
          </h5>
          {/* <span className='ps-2'>{user.postCount} Posts</span> */}
          <div
            className='mb-5 position-relative bg-primary'
            style={{
              backgroundImage: profileUser.headerImage
                ? `url(${profileUser.headerImage})`
                : 'none',
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
                  closeModal={setShowEditProfile}
                  size='lg'
                  withClose={true}
                >
                  <UpdateProfileForm />
                </PopupModal>
              </span>
            )}
          </div>

          <div className='p-2'>
            <h5 className='fw-bolder pb-0 mb-0'>
              {profileUser.name}
              <i className='fa fa-badge-check text-primary'></i>
            </h5>
            <h6 className='pt-0'>{`@${profileUser.username}`}</h6>
            <p className='pt-2'>{profileUser.bio}</p>
            <b>{profileUser ? profileUser.followeeCount : 0}</b> Following
            <b className='ms-4'>
              {profileUser ? profileUser.followerCount : 0}
            </b>{' '}
            Followers
            {!isAuthUser && <FollowButton userId={profileUser.id} />}
          </div>
        </>
      )}
    </>
  );
};

export default memo(ProfileInfo);

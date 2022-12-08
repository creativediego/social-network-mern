import * as React from 'react';
import { Link } from 'react-router-dom';
import { AvatarImage, FollowButton } from '../../components';
import { IUser } from '../../interfaces/IUser';

interface PeopleSearchResultsProps {
  users: IUser[];
}

const getResultElement = (user: IUser) => (
  <div
    key={user.id}
    className='d-flex my-2 align-items-center justify-content-between list-group-item'
  >
    <Link
      to={`/${user.id}/tuits`}
      className='position-relative flex-fill text-decoration-none'
      style={{ zIndex: '1' }}
    >
      <div className='d-flex align-items-center'>
        <AvatarImage profilePhoto={user.profilePhoto} size={60} />
        <div className='d-flex flex-column flex-fill'>
          <span className='fs-6 text-white fw-bold'>
            {user.name || user.firstName}
          </span>
          <span>@{user.username}</span>
        </div>
      </div>
    </Link>
    <div className='ms-auto position-relative' style={{ zIndex: '22' }}>
      <FollowButton userToFollow={user} />
    </div>
    <hr />
  </div>
);
const UserSearchResults = ({
  users,
}: PeopleSearchResultsProps): JSX.Element => {
  return <div>{users && users.map((user) => getResultElement(user))}</div>;
};

export default UserSearchResults;

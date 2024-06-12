import { memo } from 'react';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../../components';
import { IUser } from '../../interfaces/IUser';

/**
 * `PeopleSearchResultsProps` is the props object passed to the `PeopleSearchResults` component.
 *
 * @typedef {Object} PeopleSearchResultsProps
 * @property {IUser[]} users - An array of user objects.
 */
interface PeopleSearchResultsProps {
  users: IUser[];
}

/**
 * `getPersonElement` is a function that generates a JSX element for a user.
 *
 * @function
 * @param {IUser} user - The user object.
 * @returns {JSX.Element} A JSX element representing the user.
 */
const getPersonElement = (user: IUser): JSX.Element => (
  <div
    key={user.id}
    className='d-flex my-2 align-items-center justify-content-between list-group-item'
  >
    <Link
      to={`/${user.username}/posts`}
      className='position-relative flex-fill text-decoration-none'
      style={{ zIndex: '1' }}
    >
      <div className='d-flex align-items-center'>
        <AvatarImage profilePhoto={user.profilePhoto} size={60} />
        <div className='d-flex flex-column flex-fill'>
          <span className='fs-6 text-white fw-bold'>{user.name}</span>
          <span>@{user.username}</span>
        </div>
      </div>
    </Link>
    {/* <div className='ms-auto position-relative' style={{ zIndex: '22' }}>
      <FollowButton userToFollow={user} />
    </div> */}
    <hr />
  </div>
);

/**
 * `PeopleSearchResults` is a component that displays a list of users from search results.
 *
 * It maps over the `users` prop and renders a user element for each user.
 *
 * @component
 * @example
 * Example usage of PeopleSearchResults component
 * <PeopleSearchResults users={sampleUsers} />
 *
 * @param {PeopleSearchResultsProps} props - The properties that define the PeopleSearchResults component.
 * @param {IUser[]} props.users - An array of user objects.
 *
 * @returns {JSX.Element} A JSX element representing the list of users.
 */
const UserSearchResults = ({
  users,
}: PeopleSearchResultsProps): JSX.Element => {
  return <div>{users.map((user: IUser) => getPersonElement(user))}</div>;
};

export default memo(UserSearchResults);

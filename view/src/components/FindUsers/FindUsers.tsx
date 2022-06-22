import * as React from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { IUser } from '../../interfaces/IUser';
// @ts-ignore
import { clearFoundUsers } from '../../redux/messageSlice';
// @ts-ignore
import { findUsersByNameThunk } from '../../redux/messageThunks';
import Search from '../Search/Search';

interface FindUserProps {
  selectedUsers: IUser[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}
/**
 * Container that displays a search bar to search for users and results.
 */
const FindUsers: React.FC<FindUserProps> = ({
  selectedUsers,
  setSelectedUsers,
}: FindUserProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const allFoundUsers = useAppSelector(
    (state) => state.messages.foundUsersForNewChat
  );
  const [searchValue, setSearchValue] = React.useState('');

  /**
   * Uses search value from Search component to dispatch an API call to find users by name or username.
   */
  const findAllUsers = React.useCallback(() => {
    if (!searchValue) return;
    return dispatch(findUsersByNameThunk(searchValue));
  }, [dispatch, searchValue]);

  React.useEffect(() => {
    findAllUsers();
  }, [findAllUsers]);

  /**
   * When the user selects someone from the search results, this function resets the search inbox value, clears the found users in the results in redux state, and sets the state of the selected users maintained by the parent component (which then makes an API call).
   */
  const selectUsersForParentComponent = (user: IUser) => {
    setSearchValue('');
    dispatch(clearFoundUsers());
    return setSelectedUsers([...selectedUsers, user]);
  };
  return (
    <div>
      <Search
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        placeHolder='Search for user'
      />
      {selectedUsers.map((user) => (
        <span key={user.id} className='badge rounded-pill bg-primary'>
          {user.name || user.firstName}
        </span>
      ))}
      <hr />

      <h5 className='mt-4'>Results</h5>
      {allFoundUsers.map((user: IUser) => (
        <div key={user.id}>
          <p
            className='btn'
            onClick={() => selectUsersForParentComponent(user)}
          >
            {user.name || user.firstName} @{user.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FindUsers;

import { IUser } from '../../../../interfaces/IUser';
import { AvatarImage } from '../../../index';

/**
 * `SelectedUsersListProps` is an interface for the properties of the `NewChatSelectedUsersList` component.
 *
 * @property {IUser[]} selectedUsers - The users selected for the new chat.
 * @property {(userId: string) => void} removeSelectedUser - The function to remove a user from the selected users.
 *
 * @example
 * const props: SelectedUsersListProps = {
 *   selectedUsers: [user1, user2],
 *   removeSelectedUser: (userId) => { ... },
 * };
 *
 * @see {@link IUser} for the interface of a user.
 * @see {@link NewChatSelectedUsersList} for the component that uses this interface.
 */
interface NewChatUsersResultsProps {
  searchResults: IUser[];
  selectUsersForChat: (user: IUser) => void;
}

/**
 * `NewChatUsersResultsList` is a component that displays a list of users found in the search.
 * Each user is displayed with an avatar and a button. When the button is clicked, the user is selected for the new chat.
 *
 * @param {NewChatUsersResultsProps} props - Includes the search results and the function to select users for the new chat.
 * @param {IUser[]} props.searchResults - The users found in the search.
 * @param {(user: IUser) => void} props.selectUsersForChat - The function to select a user for the new chat.
 *
 * @returns {JSX.Element} The `NewChatUsersResultsList` component, which includes a list of users with avatars and buttons.
 *
 * @example
 * <NewChatUsersResultsList searchResults={searchResults} selectUsersForChat={selectUsersForChat} />
 *
 * @see {@link AvatarImage} for the component that displays the user's avatar.
 */

const NewChatUsersResultsList = ({
  searchResults,
  selectUsersForChat,
}: NewChatUsersResultsProps) => {
  return (
    <div style={{ overflowY: 'scroll' }}>
      {searchResults.map((user: IUser) => (
        <div>
          <button className='btn p-1 ' onClick={() => selectUsersForChat(user)}>
            <div key={user.id} className='d-flex align-items-center'>
              <div>
                <AvatarImage profilePhoto={user.profilePhoto} size={40} />
              </div>
              <div className='d-flex align-items-center m-2'>
                <p className='m-0'>{user.name}</p>
                <p className='m-0 badge'>@{user.username}</p>
              </div>
            </div>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NewChatUsersResultsList;

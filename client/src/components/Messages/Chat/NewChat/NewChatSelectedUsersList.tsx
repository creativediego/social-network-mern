import { IUser } from '../../../../interfaces/IUser';

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
interface SelectedUsersListProps {
  selectedUsers: IUser[];
  removeSelectedUser: (userId: string) => void;
}

/**
 * `NewChatSelectedUsersList` is a component that displays a list of users selected for a new chat.
 * Each user is displayed as a clickable badge. When a badge is clicked, the user is removed from the selected users.
 *
 * @param {SelectedUsersListProps} props - The properties passed to the component.
 * @param {IUser[]} props.selectedUsers - The users selected for the new chat.
 * @param {(userId: string) => void} props.removeSelectedUser - The function to remove a user from the selected users.
 *
 * @returns {JSX.Element} The `NewChatSelectedUsersList` component, which includes a list of badges for the selected users.
 *
 * @example
 * <NewChatSelectedUsersList selectedUsers={selectedUsers} removeSelectedUser={removeSelectedUser} />
 */
const NewChatSelectedUsersList = ({
  selectedUsers,
  removeSelectedUser,
}: SelectedUsersListProps): JSX.Element => (
  <div className='mt-3'>
    {selectedUsers.map((user) => (
      <span
        key={user.id}
        onClick={() => removeSelectedUser(user.id)}
        className='badge rounded-pill bg-primary btn'
      >
        {user.name}
      </span>
    ))}
  </div>
);

export default NewChatSelectedUsersList;

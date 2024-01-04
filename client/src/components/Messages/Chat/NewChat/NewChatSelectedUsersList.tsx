import React from 'react';
import { IUser } from '../../../../interfaces/IUser';

interface SelectedUsersListProps {
  selectedUsers: IUser[];
  removeSelectedUser: (userId: string) => void;
}

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

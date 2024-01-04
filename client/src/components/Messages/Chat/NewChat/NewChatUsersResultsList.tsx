import React from 'react';
import { IUser } from '../../../../interfaces/IUser';

interface NewChatUsersResultsProps {
  searchResults: IUser[];
  selectUsersForChat: (user: IUser) => void;
}

const NewChatUsersResultsList = ({
  searchResults,
  selectUsersForChat,
}: NewChatUsersResultsProps) => {
  return (
    <div style={{ overflowY: 'scroll' }}>
      {searchResults.map((user: IUser) => (
        <div key={user.id}>
          <p className='btn p-1' onClick={() => selectUsersForChat(user)}>
            {user.name} @{user.username}
          </p>
        </div>
      ))}
    </div>
  );
};

export default NewChatUsersResultsList;

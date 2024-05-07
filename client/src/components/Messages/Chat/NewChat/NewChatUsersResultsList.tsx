import React from 'react';
import { IUser } from '../../../../interfaces/IUser';
import { AvatarImage } from '../../../index';

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

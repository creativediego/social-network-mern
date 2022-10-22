import React from 'react';
import { ActionButton, Loader, PopupModal, Search } from '../..';
import useToggleBoolean from '../../../hooks/useToggleBoolean';
import { IUser } from '../../../interfaces/IUser';
import { findAllUsersByName } from '../../../services/users-service';
import useSearch from '../../Search/useSearch';
import useNewChat from './useNewChat';

const NewChat = () => {
  const [showModal, toggleModal] = useToggleBoolean(false);
  const { searchResults, searchLoading, searchValue, setSearch } =
    useSearch<IUser>(findAllUsersByName);
  const {
    newChatLoading,
    selectedUsers,
    selectUsersForChat,
    removeSelectedUser,
    createNewChat,
  } = useNewChat();
  return (
    <>
      <span
        style={{ zIndex: '2' }}
        className='p-0 fa-solid fa-message-plus fa-2x fa-pull-right btn text-primary fs-5'
        onClick={toggleModal}
      ></span>
      <PopupModal
        title='New Chat'
        size='sm'
        setShow={toggleModal}
        show={showModal}
      >
        <Search
          searchValue={searchValue}
          setSearchValue={setSearch}
          placeHolder='Search for people to start new chat'
        />
        <div className='mt-3'>
          {selectedUsers.map((user) => (
            <span
              key={user.id}
              onClick={() => removeSelectedUser(user.id)}
              className='badge rounded-pill bg-primary btn'
            >
              {user.name || user.firstName}
            </span>
          ))}
        </div>
        <hr />
        <Loader loading={searchLoading} />
        {searchResults.length > 0 && (
          <>
            <div className='d-flex justify-content-between align-items-center'>
              <h6 className='mt-4'>Results</h6>
              <ActionButton
                submitAction={() => {
                  toggleModal();
                  createNewChat();
                }}
                position='right'
                label='Create'
                loading={newChatLoading}
              />
            </div>

            <div style={{ overflowY: 'scroll', height: '50vh' }}>
              {searchResults.map((user: IUser) => (
                <div key={user.id}>
                  <p className='btn' onClick={() => selectUsersForChat(user)}>
                    {user.name || user.firstName} @{user.username}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </PopupModal>
    </>
  );
};

export default NewChat;

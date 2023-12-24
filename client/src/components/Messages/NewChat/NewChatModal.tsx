import React from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, Loader, PopupModal, Search } from '../..';
import { IUser } from '../../../interfaces/IUser';
import { APIfindAllUsersByName } from '../../../services/userAPI';
import { useSearch } from '../../Search/useSearch';
import { useNewChat } from './useNewChat';

interface NewChatModalProps {
  showModal: boolean;
  toggleModal: () => void;
}

const NewChatModal = ({
  showModal,
  toggleModal,
}: NewChatModalProps): JSX.Element | null => {
  const { searchResults, searchLoading, searchValue, setSearch } = useSearch<
    IUser[]
  >(APIfindAllUsersByName);
  const {
    newChatLoading,
    selectedUsers,
    selectUsersForChat,
    removeSelectedUser,
    createNewChat,
    activeChatId,
  } = useNewChat();

  if (!showModal) {
    return null;
  }

  return (
    <PopupModal
      title='Start a new chat'
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
            {user.name}
          </span>
        ))}
      </div>
      <hr />
      <Loader loading={searchLoading} />
      {searchResults && searchResults.length > 0 && (
        <>
          <div className='d-flex justify-content-between align-items-center'>
            <h6 className='mt-4'>Results</h6>
            {selectedUsers && (
              <Link
                to={`/messages/${activeChatId}`}
                id={activeChatId}
                className='text-decoration-none text-white'
              >
                <ActionButton
                  submitAction={() => {
                    createNewChat();
                    toggleModal();
                  }}
                  position='right'
                  label='Create'
                  loading={newChatLoading}
                />
              </Link>
            )}
          </div>

          <div style={{ overflowY: 'scroll', height: '50vh' }}>
            {searchResults.map((user: IUser) => (
              <div key={user.id}>
                <p className='btn' onClick={() => selectUsersForChat(user)}>
                  {user.name} @{user.username}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </PopupModal>
  );
};

export default NewChatModal;

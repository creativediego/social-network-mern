import React from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, Loader, PopupModal, Search } from '../../..';
import useToggle from '../../../../hooks/useToggle';
import { IUser } from '../../../../interfaces/IUser';
import { useSearch } from '../../../Search/hooks/useSearch';
import { useNewChat } from './hooks/useNewChat';
import NewChatSelectedUsersList from './NewChatSelectedUsersList';
import NewChatUsersResultsList from './NewChatUsersResultsList';
import { userSearchService } from '../../../../services/searchService';

/**
 * Displays a new chat button and new chat model, where the user can initiate a new chat.
 */
const NewChat = () => {
  const [showModal, toggleModal] = useToggle(false);
  const initialEmptyResults: IUser[] = [];
  const { results, loading, query, setQuery } = useSearch(
    userSearchService,
    initialEmptyResults
  );
  const {
    newChatLoading,
    selectedUsers,
    selectUsersForChat,
    removeSelectedUser,
    createNewChat,
    activeChatId,
  } = useNewChat();
  return (
    <>
      <div className='mb-3'>
        <ActionButton label='+ New Chat' submitAction={toggleModal} />
      </div>
      <PopupModal
        title='Start a new chat'
        size='lg'
        closeModal={toggleModal}
        show={showModal}
      >
        <Search
          query={query}
          setQuery={setQuery}
          placeHolder='Search for people to start new chat'
        />
        <NewChatSelectedUsersList
          selectedUsers={selectedUsers}
          removeSelectedUser={removeSelectedUser}
        />
        <hr />
        <Loader loading={loading} />
        {results && results.length > 0 && (
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
            <NewChatUsersResultsList
              searchResults={results}
              selectUsersForChat={selectUsersForChat}
            />
          </>
        )}
      </PopupModal>
    </>
  );
};

export default NewChat;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Inbox, Chat, NewChat } from '../../components';

/**
 * Displays inbox or active chat based on the route. Uses the inbox messages fetched
 * and stored in redux state to set up custom URLs for each conversation based on its ID.
 */
const MessagesPage = () => {
  return (
    <div>
      <div className='d-flex justify-content-between'>
        <h1>Messages</h1>
        <span
          className='d-flex align-items-center justify-content-center'
          title='New message'
        >
          <NewChat />
        </span>
      </div>
      <Routes>
        <Route path={`/`} element={<Inbox />} />
        <Route path={`/:urlChatId/*`} element={<Chat />} />
      </Routes>
    </div>
  );
};

export default MessagesPage;

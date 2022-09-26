import React from 'react';
import { Routes, Route } from 'react-router-dom';
// @ts-ignore
import InboxMessagesList from '../../components/Messages/Inbox/InboxMessagesList';
import Chat from '../../components/Messages/Chat/Chat';
import { Loader } from '../../components';
import useInbox from './useInbox';

/**
 * Displays inbox or active chat based on the route. Uses the inbox messages fetched
 * and stored in redux state to set up custom URLs for each conversation based on its ID.
 */
const MessagesPage = () => {
  const { inbox, activeChatId, loading } = useInbox();
  return (
    <div>
      <h1>Messages</h1>
      {inbox && inbox.length < 1 && <div>You have no messages.</div>}
      <Loader loading={loading} size='fs-4' />
      <Routes>
        <Route
          path={`/`}
          element={<InboxMessagesList conversations={inbox} />}
        />
        <Route
          path={`/${activeChatId && activeChatId}`}
          element={<Chat conversationId={activeChatId && activeChatId} />}
        />
      </Routes>
    </div>
  );
};

export default MessagesPage;

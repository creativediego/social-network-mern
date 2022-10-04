import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { InboxMessagesList } from '../../components';
import Chat from '../../components/Messages/Chat/Chat';
import { useAppSelector } from '../../redux/hooks';
import { selectActiveChatId } from '../../redux/chatSlice';

/**
 * Displays inbox or active chat based on the route. Uses the inbox messages fetched
 * and stored in redux state to set up custom URLs for each conversation based on its ID.
 */
const MessagesPage = () => {
  const activeChatId = useAppSelector(selectActiveChatId);
  return (
    <div>
      <h1>Messages</h1>
      <Routes>
        <Route path={`/`} element={<InboxMessagesList />} />
        <Route
          path={`/${activeChatId && activeChatId}`}
          element={<Chat conversationId={activeChatId && activeChatId} />}
        />
      </Routes>
    </div>
  );
};

export default MessagesPage;

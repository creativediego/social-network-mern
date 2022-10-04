import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
// @ts-ignore
import InboxMessage from './InboxMessage';
import { PopupModal } from '../../index';
import FindUsers from '../../FindUsers/FindUsers';
import { setGlobalError } from '../../../redux/errorSlice';
import useInbox from '../../../pages/MessagesPage/useInbox';
import { Loader } from '../../index';
import { createConversation as APIcreateConversation } from '../../../services/messages-service';

/**
 * A container component to display a list of conversations.
 */
const InboxMessagesList = () => {
  const { inbox, loading } = useInbox();
  const loggedInUser = useAppSelector((state) => state.user.data);
  const dispatch = useAppDispatch();
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newConversationUsers, setNewConversationUsers] = useState([]);
  let navigateToChatView = useNavigate();

  // const createNewConversation = async () => {
  //   const conversation = {
  //     createdBy: loggedInUser.id,
  //     participants: newConversationUsers.map((user) => user.id),
  //   };
  //   const newConversation = await APIcreateConversation(
  //     loggedInUser,
  //     conversation
  //   );

  //   if (newConversation.error) {
  //     return dispatch(setGlobalError(newConversation.error));
  //   }
  //   dispatch(setActiveChat(newConversation));
  //   navigateToChatView(`/messages/${newConversation.id}`, {
  //     replace: true,
  //   });
  // };

  // const newMessageModalProps = {
  //   content: {
  //     size: 'md',
  //     title: 'New Message',
  //     body: (
  //       <FindUsers
  //         selectedUsers={newConversationUsers}
  //         setSelectedUsers={setNewConversationUsers}
  //       />
  //     ),
  //     submitLabel: 'Next',
  //   },
  //   show: showNewMessageModal,
  //   setShow: setShowNewMessageModal,
  //   handleSubmit: createNewConversation,
  // };

  return (
    <>
      <Loader loading={loading} size='fs-4' />
      {inbox && inbox.length < 1 && <div>You have no messages.</div>}
      <ul className='ttr-tuits list-group'>
        {inbox.length > 0
          ? inbox.map((conversation) => (
              <InboxMessage conversation={conversation} key={conversation.id} />
            ))
          : null}
      </ul>
      {/* <button
        onClick={() => setShowNewMessageModal(true)}
        className='mt-2 me-2 btn btn-large btn-primary border border-secondary fw-bolder rounded-pill'
      >
        <span>New message</span>
      </button> */}
      {/* <PopupModal {...newMessageModalProps} /> */}
    </>
  );
};

export default memo(InboxMessagesList);

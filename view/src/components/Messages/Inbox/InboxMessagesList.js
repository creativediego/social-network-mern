import React, { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InboxMessage from './InboxMessage';
import { PopupModal } from '../../index';
import FindUsers from '../../FindUsers/FindUsers';
import { setGlobalError } from '../../../redux/errorSlice';

import { createConversation as APIcreateConversation } from '../../../services/messages-service';

/**
 * A container component to display a list of conversations.
 * @param conversations conversations list returned by an API
 * @returns {JSX.Element}
 */
const InboxMessagesList = ({ conversations = [] }) => {
  const loggedInUser = useSelector((state) => state.user.data);
  const dispatch = useDispatch();
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
    <div>
      <ul className='ttr-tuits list-group'>
        {conversations.length > 0
          ? conversations.map((conversation) => (
              <InboxMessage conversation={conversation} key={conversation.id} />
            ))
          : null}
      </ul>
      <button
        onClick={() => setShowNewMessageModal(true)}
        className='mt-2 me-2 btn btn-large btn-primary border border-secondary fw-bolder rounded-pill'
      >
        <span>New message</span>
      </button>
      {/* <PopupModal {...newMessageModalProps} /> */}
    </div>
  );
};

export default memo(InboxMessagesList);

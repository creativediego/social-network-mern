import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  findInboxMessagesThunk,
  findMessagesByConversationThunk,
} from '../../../redux/messageThunks';
import { deleteConversation } from '../../../services/messages-service';
import { setGlobalError } from '../../../redux/errorSlice';
import { IMessage } from '../../../interfaces/IMessage';

// interface InboxMessageProps {
//   message: IMessage;
// }

/**
 * A component to render each latest unique message in the inbox.
 * @param conversationconversation from a list of conversations
 */
const InboxMessage = ({ conversation: message }) => {
  const userId = useSelector((state) => state.user.data.id);
  const dispatch = useDispatch();

  const handleDeleteConversation = async () => {
    const res = await deleteConversation(userId, message.conversation);
    if (res.error) {
      return dispatch(setGlobalError(res.error));
    }
    return dispatch(findInboxMessagesThunk());
  };

  return (
    <li className='p-2 inbox-item list-group-item d-flex rounded-0'>
      <Link
        style={{ zIndex: '1', flex: '1' }}
        to={`/messages/${message.conversation}`}
        id={message.id}
        className='text-decoration-none text-white'
        onClick={() =>
          dispatch(findMessagesByConversationThunk(message.conversation))
        }
      >
        <div className='w-100 d-flex'>
          <div className='pe-2'>
            {message.recipients && message.recipients.length > 0 && (
              <img
                src={
                  message.recipients[0].profilePhoto
                    ? message.recipients[0].profilePhoto
                    : `../images/${message.recipients[0].username}.jpg`
                }
                className='ttr-tuit-avatar-logo rounded-circle'
                alt='profile'
              />
            )}
          </div>
          <div className='w-100'>
            <p className='fs-6 fw-bold'>
              {message &&
                message.recipients.length === 1 &&
                message.recipients[0].name}
              {message &&
                message.recipients.length > 1 &&
                message.recipients[0].name +
                  ', ' +
                  message.recipients[1].name +
                  ' ...'}
            </p>
            {message && message.message}
          </div>
        </div>
      </Link>
      <span>
        <span
          onClick={() => handleDeleteConversation(message.id)}
          style={{ zIndex: '2' }}
          className='fa-duotone p-0 fa-trash-xmark fa-2x fa-pull-right btn text-dark fs-5'
        ></span>
      </span>
    </li>
  );
};

export default InboxMessage;

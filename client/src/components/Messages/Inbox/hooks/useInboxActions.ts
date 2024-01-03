import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  closeModal,
  openModal,
  selectConfirmModal,
} from '../../../../redux/modalSlice';
import { IMessage } from '../../../../interfaces/IMessage';
import { deleteInboxChatThunk } from '../../../../redux/inboxSlice';

export const useInboxActions = (
  message: IMessage
): { handleDelete: Function } => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalConfirmed = useAppSelector(selectConfirmModal);
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    setConfirmDelete(true);
    dispatch(
      openModal({
        title: `Delete conversation?`,
        content:
          'Are you sure you want to delete this conversation? Deleting it will remove this conversation from your inbox, but it will still be visible to the other people in the conversation.',
        actionLabel: 'Delete',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (modalConfirmed && confirmDelete) {
      dispatch(deleteInboxChatThunk(message.chatId));
      dispatch(closeModal());
    }
  }, [modalConfirmed, confirmDelete, dispatch, message.chatId]);

  return { handleDelete };
};

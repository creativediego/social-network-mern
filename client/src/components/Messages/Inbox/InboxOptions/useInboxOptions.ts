import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  closeModal,
  openModal,
  selectConfirmModal,
} from '../../../../redux/modalSlice';
import { IMessage } from '../../../../interfaces/IMessage';
import { deleteInboxChat } from '../../../../redux/inboxSlice';

/**
 * useInboxActions hook.
 *
 * This hook provides a function to handle the deletion of a message.
 * It uses the `useAppDispatch` and `useAppSelector` hooks from Redux,
 * as well as the `useState` and `useCallback` hooks from React.
 *
 * The `handleDelete` function sets `confirmDelete` to `true` and dispatches
 * the `openModal` action to open a confirmation modal.
 *
 * @param {IMessage} message - The message object.
 * @returns {{ handleDelete: () => void }} An object with the `handleDelete` function.
 */
export const useInboxOptions = (
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
      dispatch(deleteInboxChat(message.chatId));
      dispatch(closeModal());
    }
  }, [modalConfirmed, confirmDelete, dispatch, message.chatId]);

  return { handleDelete };
};

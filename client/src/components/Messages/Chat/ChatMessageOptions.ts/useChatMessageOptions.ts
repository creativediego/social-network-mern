import { useCallback, useEffect, useState } from 'react';
import { IMessage } from '../../../../interfaces/IMessage';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { deleteMessageThunk } from '../../../../redux/chatSlice';
import {
  closeModal,
  openModal,
  selectConfirmModal,
} from '../../../../redux/modalSlice';

/**
 * `useChatMessageOptions` is a custom hook that provides state and actions for the chat message options.
 * It uses the `useAppDispatch` and `useAppSelector` hooks from Redux to interact with the global state.
 *
 * @param {IMessage} message - The message for which to display options.
 *
 * @returns {object} An object containing the following values:
 * - `handleDelete`: A function to handle the deletion of the message. It opens a confirmation modal before deleting the message.
 *
 * @example
 * const { handleDelete } = useChatMessageOptions(message);
 *
 * @see {@link useAppDispatch} and {@link useAppSelector} for the hooks that provide access to the Redux store.
 * @see {@link deleteMessageThunk} for the action that deletes a message from the chat.
 * @see {@link openModal} and {@link closeModal} for the actions that manage the confirmation modal.
 */

const useChatMessageOptions = (message: IMessage) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalConfirmed = useAppSelector(selectConfirmModal);
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    setConfirmDelete(true);
    dispatch(
      openModal({
        title: `Delete message?`,
        content:
          'Are you sure you want to delete this message? It will only be removed for you. Other people in the chat will still see it.',
        actionLabel: 'Delete',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (modalConfirmed && confirmDelete) {
      dispatch(deleteMessageThunk(message.id));
      dispatch(closeModal());
    }
  }, [modalConfirmed, confirmDelete, dispatch, message]);

  return { handleDelete };
};

export default useChatMessageOptions;

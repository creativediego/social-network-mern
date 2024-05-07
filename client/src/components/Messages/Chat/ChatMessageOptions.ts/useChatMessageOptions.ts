import { useCallback, useEffect, useState } from 'react';
import { IMessage } from '../../../../interfaces/IMessage';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { deleteMessageThunk } from '../../../../redux/chatSlice';
import {
  closeModal,
  openModal,
  selectConfirmModal,
} from '../../../../redux/modalSlice';

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

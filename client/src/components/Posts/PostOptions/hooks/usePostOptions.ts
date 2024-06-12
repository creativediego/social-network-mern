import { useCallback, useEffect, useState } from 'react';
import { IPost } from '../../../../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  closeModal,
  openModal,
  selectConfirmModal,
} from '../../../../redux/modalSlice';
import { deletePostThunk } from '../../../../redux/postSlice';

/**
 * `usePostOptions` is a custom hook that provides a function for handling the deletion of a post.
 * It uses the `useState`, `useCallback`, and `useEffect` hooks from React to manage the state and side effects, and the `useAppDispatch` and `useAppSelector` hooks from Redux to dispatch actions and select state from the Redux store.
 * When the `handleDelete` function is called, it sets `confirmDelete` to `true` and dispatches an action to open a modal with a title of 'Delete post?', a content of 'Are you sure you want to delete this post?', and an action label of 'Delete'.
 *
 * @param {IPost} post - The post to be deleted.
 *
 * @returns {{ handleDelete: Function }} An object containing the `handleDelete` function.
 *
 * @example
 * const { handleDelete } = usePostOptions(post);
 *
 * @see {@link useState}, {@link useCallback}, and {@link useEffect} for the hooks that manage the state and side effects.
 * @see {@link useAppDispatch} and {@link useAppSelector} for the hooks that dispatch actions and select state from the Redux store.
 * @see {@link openModal} for the action that opens the modal.
 */
export const usePostOptions = (post: IPost): { handleDelete: Function } => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalConfirmed = useAppSelector(selectConfirmModal);
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    setConfirmDelete(true);
    dispatch(
      openModal({
        title: `Delete post?`,
        content: 'Are you sure you want to delete this post?',
        actionLabel: 'Delete',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (modalConfirmed && confirmDelete) {
      dispatch(deletePostThunk(post.id));
      dispatch(closeModal());
    }
  }, [modalConfirmed, confirmDelete, dispatch, post.id]);

  return { handleDelete };
};

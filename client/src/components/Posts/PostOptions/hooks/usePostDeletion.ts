import { useCallback, useEffect, useState } from 'react';
import { IPost } from '../../../../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import {
  closeModal,
  openModal,
  selectConfirmModal,
} from '../../../../redux/modalSlice';
import {
  deletePostThunk,
  selectPostsLoading,
} from '../../../../redux/postSlice';

/**
 * `usePostDeletion` is a custom hook that provides the functionality to delete a post.
 *
 * It uses the `useAppDispatch` and `useAppSelector` hooks from Redux to dispatch actions and select state.
 *
 * @hook
 * @example
 * Example usage of usePostDeletion hook
 * const { handleDeletePost } = usePostDeletion(post);
 *
 * @param {IPost} post - The post object to delete.
 *
 * @returns {{ handleDeletePost: Function, loading: boolean }} An object containing the `handleDeletePost` function and the `loading` state. */
export const usePostDeletion = (
  post: IPost
): { handleDeletePost: Function; loading: boolean } => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalConfirmed = useAppSelector(selectConfirmModal);
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectPostsLoading);

  const handleDeletePost = useCallback(() => {
    setConfirmDelete(true);
    dispatch(
      openModal({
        title: 'Delete post?',
        content: 'Are you sure you want to delete this post?',
        actionLabel: 'Delete',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (modalConfirmed && confirmDelete && post) {
      dispatch(deletePostThunk(post.id));
      dispatch(closeModal());
    }
  }, [modalConfirmed, confirmDelete, post, dispatch]);

  return { loading, handleDeletePost };
};

import React, {
  useContext,
  createContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from 'react';
import { IPost } from '../interfaces/IPost';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { APIuserDislikesPost, APIuserLikesPost } from '../services/likeAPI';
import { closeModal, openModal, selectConfirmModal } from '../redux/modalSlice';
import { usePostAPI } from './usePostAPI';

const PostContext = createContext<IPost | null>(null);

/**
 * Context for a single post to give nested components (such as stats) access to its data.
 */
export const PostProvider = ({
  post,
  children,
}: {
  post: IPost;
  children: ReactNode;
}) => {
  return <PostContext.Provider value={post}>{children}</PostContext.Provider>;
};

/**
 * Custom hook that manages the state of fetching posts, liking, disliking, and deleting.
 */
export const usePost = () => {
  const post = useContext(PostContext);
  const [showOptions, setShowOptions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalConfirmed = useAppSelector(selectConfirmModal);
  const { deletePost, likeDislikePost, loading } = usePostAPI();

  const dispatch = useAppDispatch();

  const handleShowOptions = useCallback((status: boolean) => {
    setShowOptions(status);
  }, []);

  const handleLikePost = useCallback(
    async (postId: string) => {
      return likeDislikePost(postId, APIuserLikesPost);
    },
    [likeDislikePost]
  );

  const handleDislikePost = useCallback(
    async (postId: string) => {
      return likeDislikePost(postId, APIuserDislikesPost);
    },
    [likeDislikePost]
  );

  const handleDeletePost = useCallback(async () => {
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
      deletePost(post.id);
      dispatch(closeModal());
    }
  }, [confirmDelete, modalConfirmed, post, dispatch, deletePost]);

  return {
    loading,
    post,
    showMenu: showOptions,
    handleShowOptions,
    handleLikePost,
    handleDislikePost,
    handleDeletePost,
  };
};

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
import { closeModal, openModal, selectConfirmModal } from '../redux/modalSlice';
import { usePostAPI } from './usePostAPI';

interface IPostContext {
  post: IPost | null;
  updatePost: (post: IPost) => void;
}

export const PostContext = createContext<IPostContext | null>(null);

/**
 * Context for a single post to give nested components (such as stats) access to its data.
 */
export const PostProvider = ({
  initialState,
  children,
}: {
  initialState: IPost;
  children: ReactNode;
}) => {
  const [post, setPost] = useState<IPost>(initialState);
  // Function to update the post value
  const updatePost = (newPost: IPost) => {
    setPost((prevPost) => ({ ...prevPost, ...newPost }));
  };

  return (
    <PostContext.Provider value={{ post, updatePost }}>
      {children}
    </PostContext.Provider>
  );
};

/**
 * Custom hook that manages the state of fetching posts, liking, disliking, and deleting.
 */
export const usePost = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePost must be used within a PostProvider');
  }
  const { post, updatePost } = context;
  const [showOptions, setShowOptions] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const modalConfirmed = useAppSelector(selectConfirmModal);
  const { deletePost, loading } = usePostAPI();

  const dispatch = useAppDispatch();

  const handleShowOptions = useCallback((status: boolean) => {
    setShowOptions(status);
  }, []);

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
    handleDeletePost,
    updatePost,
  };
};

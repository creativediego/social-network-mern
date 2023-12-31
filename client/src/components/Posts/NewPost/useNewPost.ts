import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { IPost } from '../../../interfaces/IPost';
import { createPostThunk, selectPostsLoading } from '../../../redux/postSlice';
import { useAuthUser } from '../../../hooks/useAuthUser';

/**
 * A custom hook managing the state and logic for creating a new post.
 *
 * Manages the state for new post content, image upload, and post creation functionality.
 *
 * @returns {{
 *  post: IPost,
 *  setPost: React.Dispatch<React.SetStateAction<IPost>>,
 *  setImageFile: (file: File | null) => void,
 *  imagePreview: string,
 *  setInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
 *  createPost: () => Promise<void>,
 * }} An object containing state and functions for managing the new post creation.
 */
const useNewPost = () => {
  const { user: authUser } = useAuthUser();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectPostsLoading);

  // State to manage the image file and its preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');

  // State for the new post content
  const [post, setPost] = useState<IPost>({
    id: '',
    author: authUser,
    createdAt: '',
    post: '',
    image: '',
    likedBy: [],
    dislikedBy: [],
    stats: {
      likes: 0,
      dislikes: 0,
      reposts: 0,
      replies: 0,
    },
  });

  /**
   * Handles setting the image file when an image is uploaded.
   *
   * @param {File | null} file - The image file selected by the user.
   */
  const handleSetImageFile = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  /**
   * Creates a new post using the entered content and uploaded image.
   */
  const handleCreatePost = async () => {
    try {
      if (!post.post) {
        // Handle case when post content is empty
        return;
      }

      // Clear the post content after creation
      const updatedPost: IPost = { ...post, post: '', image: '', hashtags: [] };
      setPost(updatedPost);

      // Dispatch action to create the post via Redux thunk
      await dispatch(createPostThunk({ userId: authUser.id, post, imageFile }));
      setImagePreview('');
    } catch (error) {
      // Handle any errors during post creation
      console.error('Failed to create post:', error);
    }
  };

  /**
   * Handles changes in the text area input for the post content.
   *
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - The change event from the text area.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const postContent: string = e.target.value;
    const updatedPost = {
      ...post,
      post: postContent,
      hashtags: parseHashtags(postContent) || [],
    };
    setPost(updatedPost);
  };

  /**
   * Parses and extracts hashtags from the post content.
   *
   * @param {string} post - The post content to parse.
   * @returns {string[] | null} An array of extracted hashtags or null if none are found.
   */
  const parseHashtags = (post: string): string[] | null => {
    return post.toLowerCase().match(/\B(#[a-zA-Z]+\b)(?!;)/g);
  };

  /**
   * Creates a preview of the selected image file when uploaded.
   */
  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  // Return the state and functions for creating a new post
  return {
    post,
    loading,
    setPost,
    handleSetImageFile,
    imagePreview,
    handleInputChange,
    handleCreatePost,
  };
};

export default useNewPost;

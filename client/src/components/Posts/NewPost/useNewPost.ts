import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { IPost } from '../../../interfaces/IPost';
import { createPostThunk, selectPostLoading } from '../../../redux/postSlice';
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
  const loading = useAppSelector(selectPostLoading);
  // State to manage the image file and its preview
  const [postImage, setPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

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
  const handleSetPostImage = useCallback((file: File | null) => {
    setPostImage(file);
  }, []);

  const validatePost = (content: string): string[] => {
    const errors: string[] = [];
    if (!content || content.trim().length > 280) {
      errors.push('Post content must be between 1 and 280 characters.');
    }
    // Validate image for 1MB
    if (postImage && postImage.size > 1024 * 1024) {
      errors.push('Post image must be less than 1MB.');
    }
    return errors;
  };

  /**
   * Creates a new post using the entered content and uploaded image.
   */
  const handleCreatePost = async (): Promise<void> => {
    const validationErrors = validatePost(post.post);
    setErrors(validationErrors);
    if (validationErrors.length > 0) {
      return;
    }
    // Clear the post content after creation
    const updatedPost: IPost = { ...post, post: '', image: '', hashtags: [] };
    setPost(updatedPost);
    try {
      // Dispatch action to create the post via Redux thunk
      await dispatch(createPostThunk({ post, imageFile: postImage }));
      setImagePreview('');
      setErrors([]);
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
    // Auto-resize the text area as the user types
    e.currentTarget.style.height = 'auto';
    e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
    // Update the post content and extract hashtags
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
    if (!postImage) {
      setImagePreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(postImage);
    setImagePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [postImage]);

  // Return the state and functions for creating a new post
  return {
    post,
    errors,
    loading,
    setPost,
    handleSetPostImage,
    imagePreview,
    handleInputChange,
    handleCreatePost,
  };
};

export default useNewPost;

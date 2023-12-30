import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { IPost } from '../../../interfaces/IPost';
import { createPostThunk } from '../../../redux/postSlice';
import { selectAuthUser } from '../../../redux/userSlice';
import { IUser } from '../../../interfaces/IUser';

/**
 * Displays form where user can submit a new post.
 *
 */
const useNewPost = () => {
  const authUser: IUser = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [post, setPost] = React.useState<IPost>({
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

  const handleSetImageFile = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  const createPost = async (post: IPost) => {
    if (!post.post) {
      return;
    }
    setPost({ ...post, post: '', image: '', hashtags: [] });
    dispatch(createPostThunk({ userId: authUser.id, post, imageFile }));
    setImagePreview('');
  };

  const parseHashtags = (post: string): string[] | null => {
    return post.toLowerCase().match(/\B(#[a-zA-Z]+\b)(?!;)/g);
  };

  const setInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const postContent: string = e.target.value;
    const updatedPost = { ...post, post: postContent };
    const hashtags = parseHashtags(postContent);

    if (hashtags) {
      updatedPost.hashtags = hashtags;
    } else {
      updatedPost.hashtags = [];
    }
    setPost({ ...post, ...updatedPost });
  };
  // Create an image preview when image is selected.
  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile]);

  return {
    post,
    setPost,
    setImageFile: handleSetImageFile,
    imagePreview,
    setInput,
    createPost,
  };
};

export default useNewPost;

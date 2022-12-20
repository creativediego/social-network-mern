import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { IPost } from '../../interfaces/IPost';
import { createTuitThunk } from '../../redux/tuitSlice';
import { selectAuthUser } from '../../redux/userSlice';
import { IUser } from '../../interfaces/IUser';

/**
 * Displays form where user can submit a new tuit.
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
    tuit: '',
    image: '',
    likedBy: [],
    dislikedBy: [],
    stats: {
      likes: 0,
      dislikes: 0,
      retuits: 0,
      replies: 0,
    },
  });

  const handleSetImageFile = useCallback((file: File | null) => {
    console.log(file);
    setImageFile(file);
  }, []);

  const createTuit = async (tuit: IPost) => {
    if (!tuit.tuit) {
      return;
    }
    setPost({ ...tuit, tuit: '', image: '', hashtags: [] });
    dispatch(createTuitThunk({ userId: authUser.id, tuit, imageFile }));
    setImagePreview('');
    setImageFile(null);
  };

  const parseHashtags = (tuit: string): string[] | null => {
    return tuit.toLowerCase().match(/\B(#[a-zA-Z]+\b)(?!;)/g);
  };

  const setInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tuitContent: string = e.target.value;
    const updatedTuit = { ...post, tuit: tuitContent };
    const hashtags = parseHashtags(tuitContent);

    if (hashtags) {
      updatedTuit.hashtags = hashtags;
    } else {
      updatedTuit.hashtags = [];
    }
    setPost({ ...post, ...updatedTuit });
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
    tuit: post,
    setTuit: setPost,
    setImageFile: handleSetImageFile,
    imagePreview,
    setInput,
    createTuit,
  };
};

export default useNewPost;

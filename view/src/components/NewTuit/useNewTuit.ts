import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ITuit } from '../../interfaces/ITuit';
import { createTuitThunk } from '../../redux/tuitSlice';
import { selectAuthUser } from '../../redux/userSlice';
import { IUser } from '../../interfaces/IUser';

/**
 * Displays form where user can submit a new tuit.
 *
 */
const useNewTuit = () => {
  const authUser: IUser = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const [tuit, setTuit] = React.useState<ITuit>({
    id: '',
    author: authUser,
    createdAt: '',
    tuit: '',
    image: '',
  });
  const [imageFile, setImageFile] = React.useState<File | null>(null);

  const handleSetImageFile = useCallback((file: File | null) => {
    setImageFile(file);
  }, []);

  const createTuit = async (tuit: ITuit) => {
    if (!tuit.tuit) return;
    setTuit({ ...tuit, tuit: '', image: '', hashtags: [] });
    dispatch(createTuitThunk({ userId: authUser.id, tuit, imageFile }));
  };

  const parseHashtags = (tuit: string): string[] | null => {
    return tuit.toLowerCase().match(/\B(\#[a-zA-Z]+\b)(?!;)/g);
  };

  const setInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tuitContent: string = e.target.value;
    const updatedTuit = { ...tuit, tuit: tuitContent };
    const hashtags = parseHashtags(tuitContent);

    if (hashtags) {
      updatedTuit.hashtags = hashtags;
    } else {
      updatedTuit.hashtags = [];
    }
    setTuit({ ...tuit, ...updatedTuit });
  };

  return {
    tuit,
    setTuit,
    setImageFile: handleSetImageFile,
    setInput,
    createTuit,
  };
};

export default useNewTuit;

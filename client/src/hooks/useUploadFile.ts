import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { StoragePaths } from '../interfaces/ImageTypes';
import { firebaseUploadFile } from '../firebase/firebasestorageAPI';
import { setGlobalError } from '../redux/alertSlice';
import { useAuthUser } from './useAuthUser';

export const useUploadFile = (filePath: StoragePaths) => {
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const isMounted = useRef(true);
  const dispatch = useAppDispatch();

  const uploadFile = async (file: File | null, filename: string) => {
    if (!file) return;
    const path = `${filePath}/${user.uid}/${filename}`;
    setLoading(true);
    try {
      const newFileURL = await firebaseUploadFile(path, file);
      if (isMounted) {
        setLoading(false);
        setFileURL(newFileURL);
      }
    } catch (err) {
      setLoading(false);
      const message =
        'Sorry, we ran into an error uploading your profile image. Try again later.';
      dispatch(setGlobalError({ message }));
    }
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return { uploadFile, loading, fileURL };
};

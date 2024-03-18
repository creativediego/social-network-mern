import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

export const useUploadFile = () => {
  const [filePreview, setImagePreview] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const isMounted = useRef(true);

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  return {
    filePreview,
    file,
    handleImageChange,
  };
};

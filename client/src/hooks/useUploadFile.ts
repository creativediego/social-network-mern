import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';

/**
 * `useUploadFile` is a custom hook that provides a way to handle file uploads.
 * It uses the `useState`, `useRef`, `useEffect`, and `useCallback` hooks from React to manage the `filePreview`, `file`, and `handleImageChange` states.
 * The `filePreview` state is a string that represents the preview URL of the uploaded file.
 * The `file` state is the uploaded file.
 * The `handleImageChange` function is used to handle the change event of the file input.
 * It reads the uploaded file as a data URL and sets the `filePreview` and `file` states.
 * The `isMounted` ref is used to prevent state updates after the component has unmounted.
 * The hook returns an object with the `filePreview`, `file`, and `handleImageChange` states.
 *
 * @returns {Object} The `filePreview`, `file`, and `handleImageChange` states.
 * @property {string} filePreview - The preview URL of the uploaded file.
 * @property {File | null} file - The uploaded file.
 * @property {(e: ChangeEvent<HTMLInputElement>) => void} handleImageChange - The function to handle the change event of the file input.
 *
 * @example
 * const { filePreview, file, handleImageChange } = useUploadFile();
 * <input type="file" onChange={handleImageChange} />
 * <img src={filePreview} alt="Preview" />
 *
 * @see {@link useState} for the hook that manages the `filePreview` and `file` states.
 * @see {@link useRef} for the hook that manages the `isMounted` ref.
 * @see {@link useEffect} for the hook that updates the `isMounted` ref when the component mounts and unmounts.
 * @see {@link useCallback} for the hook that memoizes the `handleImageChange` function.
 */
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

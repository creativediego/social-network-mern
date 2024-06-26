import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { ImageTypes } from '../interfaces/ImageTypes';
import { storage, auth } from '../config/firebaseConfig';

const errors = {
  NOT_LOGGED_IN: 'Error uploading image: Path or file name not provided.',
};

export const firebaseUploadFile = async (
  path: string,
  file: File
): Promise<string> => {
  try {
    const firebaseUser = auth.currentUser;
    if (!path || !file) {
      throw new Error('Error uploading image: Path or file name not provided.');
    }
    if (!firebaseUser) {
      throw new Error(errors.NOT_LOGGED_IN);
    }
    const storageRef = ref(storage, path);
    const fileSnapshot = await uploadBytes(storageRef, file);
    const fileURL: string = await getDownloadURL(fileSnapshot.ref);
    return fileURL;
  } catch (err) {
    throw new Error('Error uploading image.');
  }
};

export const firebaseUploadAvatar = async (file: File): Promise<string> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error(errors.NOT_LOGGED_IN);
  }
  return await firebaseUploadFile(
    `users/${firebaseUser.uid}/profile/${firebaseUser.uid}-avatar`,
    file
  );
};

export const firebaseUploadHeaderImage = async (
  file: File
): Promise<string> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error(errors.NOT_LOGGED_IN);
  }
  return await firebaseUploadFile(
    `users/${firebaseUser.uid}/profile/${firebaseUser.uid}-header`,
    file
  );
};

export const firebaseUploadProfileImage = async (
  file: File,
  type: ImageTypes
): Promise<string> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error(errors.NOT_LOGGED_IN);
  }
  return await firebaseUploadFile(
    `users/${firebaseUser.uid}/profile/${firebaseUser.uid}-${type}`,
    file
  );
};

export const uploadPostImage = async (
  file: File,
  postId: string
): Promise<string> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) {
    throw new Error(errors.NOT_LOGGED_IN);
  }
  return await firebaseUploadFile(
    `users/${firebaseUser.uid}/posts/${postId}`,
    file
  );
};

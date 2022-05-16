import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage, auth } from './firebase-config';

const uploadImage = async (path, file) => {
  try {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser || !path || !file) return;
    const storageRef = ref(storage, path);
    const fileSnapshot = await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(fileSnapshot.ref);
    return fileURL;
  } catch (err) {
    console.log(err);
  }
};

export const uploadAvatar = async (file) => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return;
  return await uploadImage(
    `users/${firebaseUser.uid}/profile/${firebaseUser.uid}-avatar`,
    file
  );
};

export const uploadHeaderImage = async (file) => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return;
  return await uploadImage(
    `users/${firebaseUser.uid}/profile/${firebaseUser.uid}-header`,
    file
  );
};

export const uploadTuitImage = async (file, tuitId) => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return;
  return await uploadImage(`users/${firebaseUser.uid}/tuits/${tuitId}`, file);
};

import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage, auth } from './firebase-config';

export const uploadImage = async (fileName, file) => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser || !fileName || !file) return;
  const storageRef = ref(storage, `users/${firebaseUser.uid}/${fileName}`);
  const fileSnapshot = await uploadBytes(storageRef, file);
  const fileURL = await getDownloadURL(fileSnapshot.ref);
  return fileURL;
};

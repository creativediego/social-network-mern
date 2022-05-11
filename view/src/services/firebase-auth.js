import { auth } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';
import { GoogleAuthProvider } from 'firebase/auth';
import { getProfile } from './auth-service';
import { setAuthToken } from './helpers';
import { clearUser } from '../redux/userSlice';

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const user = result.user;
    setAuthToken(user.accessToken);
    return await getProfile();
  } catch (error) {
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    return { error: error.message };
  }
};

export const onFirebaseLogout = async () => {
  auth().onAuthStateChanged(function (user) {
    if (user) {
      return;
    } else {
    }
  });
};

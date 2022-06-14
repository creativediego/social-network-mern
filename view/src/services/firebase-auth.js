import { auth } from './firebase-config';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { setAuthToken } from './helpers';
import { clearUser } from '../redux/userSlice';

export const loginWithGoogle = async (ThunkAPI) => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { uid: user.uid, email: user.email, name: user.displayName };
  } catch (error) {
    return { error: 'Login with Google error: Please try logging in later.' };
  }
};

export const firebaseLoginWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    return { uid: user.uid, email: user.email, name: user.displayName };
  } catch (error) {
    let message;
    if (error.code === 'auth/wrong-password' || 'auth/wrong-email') {
      message = 'Wrong email or password.';
    } else {
      message = 'Login with email error: Please try logging in later.';
    }
    return { error: message };
  }
};

export const fireBaseRegisterUser = async (email, password) => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user; // signed in
    return user;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      return { error: 'A user with this email already exists.' };
    }
    return { error: 'Registration error: Please try again later.' };
  }
};

export const onFirebaseAuthStateChange = async (
  activeAction,
  expiredAction
) => {
  auth.onAuthStateChanged(function (user) {
    if (user) {
      setAuthToken(user.accessToken);
      return activeAction();
    } else {
      return expiredAction();
    }
  });
};

export const firebaseLogout = async (ThunkAPI) => {
  await auth.signOut();
  return ThunkAPI.dispatch(clearUser());
};

export const isLoggedIn = async () => {
  const user = auth.currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
};

import { auth } from './firebase-config';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { setLocalAuthToken } from './api-helpers';
import { config } from '../config/appConfig';

const CLIENT_URL = `${config.baseURL}`;

export const firebaseGoogleLogin = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    setLocalAuthToken(await result.user.getIdToken());
    return result.user;
  } catch (error) {
    throw new Error('Login with Google error: Please try logging in later.');
  }
};

export const firebaseLoginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    setLocalAuthToken(await result.user.getIdToken());
    return user;
  } catch (error: any) {
    if (error.code === 'auth/wrong-password' || 'auth/wrong-email') {
      throw new Error('Wrong email or password.');
    } else {
      throw new Error('Login with email error: Please try logging in later.');
    }
  }
};

export const fireBaseRegisterUser = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = credentials.user; // signed in
    await sendEmailVerification(user, { url: CLIENT_URL });
    setLocalAuthToken(await user.getIdToken());
    return user;
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      throw new Error('A user with this email already exists.');
    }
    throw new Error('Registration error: Please try again later.');
  }
};

export const onFirebaseAuthStateChange = async (
  activeAction: Function,
  expiredAction: Function
) => {
  auth.onAuthStateChanged(function (user: any) {
    if (user) {
      setLocalAuthToken(user.accessToken);
      return activeAction();
    } else {
      return expiredAction();
    }
  });
};

export const firebaseLogout = async () => {
  return await auth.signOut();
};

export const firebaseIsLoggedIn = async () => {
  const user = auth.currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
};

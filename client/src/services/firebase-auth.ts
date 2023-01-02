import { auth } from './firebase-config';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { setAuthToken } from './helpers';

const CLIENT_URL = `${process.env.REACT_APP_CLIENT_URL}`;

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return { uid: user.uid, email: user.email, name: user.displayName };
  } catch (error) {
    return { error: 'Login with Google error: Please try logging in later.' };
  }
};

export const firebaseLoginWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
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
      setAuthToken(user.accessToken);

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

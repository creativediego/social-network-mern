import { auth } from '../config/firebaseConfig';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendEmailVerification,
  User,
} from 'firebase/auth';
import { setLocalAuthToken } from '../util/tokenManagement';
import { configENV } from '../config/appConfig';
import { FriendlyError } from '../interfaces/IError';

const CLIENT_URL = `${configENV.baseURL}`;

export const firebaseGoogleLogin = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    setLocalAuthToken(await result.user.getIdToken());
    return result.user;
  } catch (error) {
    throw new FriendlyError(
      'Login with Google error: Please try logging in later.'
    );
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
      throw new FriendlyError('Wrong email or password.');
    } else {
      throw new FriendlyError(
        'Login with email error: Please try logging in later.'
      );
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
      throw new FriendlyError('A user with this email already exists.');
    }
    throw new FriendlyError('Registration error: Please try again later.');
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
  await auth.signOut();
};

export const firebaseIsLoggedIn = async () => {
  const user = auth.currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
};

// Check if Firebase provider is email/password.
export const isFirebaseIsEmailProvider = async () => {
  const user = auth.currentUser;
  if (user) {
    return user.providerData[0].providerId === 'password';
  } else {
    return false;
  }
};

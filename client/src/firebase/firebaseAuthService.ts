import { auth } from '../config/firebaseConfig';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateEmail,
  updatePassword,
  User,
} from 'firebase/auth';
import { setLocalAuthToken } from '../util/tokenManagement';
import { urlConfig } from '../config/appConfig';
import { FriendlyError } from '../interfaces/IError';

const CLIENT_URL = `${urlConfig.baseURL}`;

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

export const firebaseUpdateEmail = async (email: string) => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await updateEmail(user, email);
    }
  } catch (error) {
    throw new FriendlyError('Error updating email.');
  }
};

export const firebaseUpdatePassword = async (password: string) => {
  try {
    const user = auth.currentUser;
    if (user) {
      return await updatePassword(user, password);
    }
  } catch (error) {
    throw new FriendlyError('Error updating password.');
  }
};

export const firebaseIsEmailVerified = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        user.reload().then(() => {
          resolve(user.emailVerified);
        });
      } else {
        resolve(false);
      }
      unsubscribe(); // Stop listening for further changes
    });
  });
};
export const firebaseSendVerificationEmail = async (): Promise<void> => {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user, { url: import.meta.env.VITE_BASE_URL! });
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

export const onFirebaseSessionChange = async (expiredAction: () => void) => {
  auth.onAuthStateChanged(async function (user: User | null) {
    if (user) {
      const token = await user.getIdToken();
      setLocalAuthToken(token);
    } else {
      return expiredAction();
    }
  });
};

export const isFirebaseSessionValid = async () => {
  const user = auth.currentUser;
  if (user) {
    setLocalAuthToken(await user.getIdToken());
    return true;
  } else {
    return false;
  }
};

export const firebaseLogout = async () => {
  await auth.signOut();
};

export const isLoggedIntoFirebase = async () => {
  const user = auth.currentUser;
  if (user) {
    return true;
  } else {
    return false;
  }
};

// Checks if user registered with provider other than email/password
export const registeredWithProvider = async () => {
  const user = auth.currentUser;
  if (user) {
    return user.providerData[0].providerId !== 'password';
  } else {
    return false;
  }
};

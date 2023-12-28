import { IUser } from '../interfaces/IUser';
import { Requests, callAPI } from '../util/apiConfig';
import { config } from '../config/appConfig';
import {
  fireBaseRegisterUser,
  firebaseGoogleLogin,
  firebaseLoginWithEmail,
  firebaseLogout,
  isFirebaseIsEmailProvider,
} from '../firebase/firebaseAuthAPI';

const SECURITY_API = config.authApi;

export const AUTHregister = async (email: string, password: string) =>
  await fireBaseRegisterUser(email, password);

export const AUTHlogin = async (email: string, password: string) =>
  await firebaseLoginWithEmail(email, password);

export const AUTHloginWithGoogle = async () => await firebaseGoogleLogin();

export const AUTHlogout = async () => await firebaseLogout;

export const registeredWithEmailPassword = async () =>
  await isFirebaseIsEmailProvider();

export const getProfile = () =>
  callAPI<IUser>(
    `${SECURITY_API}/profile`,
    Requests.GET,
    'Error getting profile. Try again logging in again.'
  );

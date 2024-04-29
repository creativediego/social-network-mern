/**
 * Includes redux state management for user actions such as login and update user.
 */
import {
  AnyAction,
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  ThunkDispatch,
} from '@reduxjs/toolkit';
import { authService } from '../services/authService';
import { clearLocalAuthToken } from '../util/tokenManagement';
import { IUser } from '../interfaces/IUser';
import { INotification } from '../interfaces/INotification';
import type { RootState } from './store';
import { setSuccessAlert } from './alertSlice';
import { clearProfile } from './profileSlice';
import { clearChat } from './chatSlice';
import {
  firebaseUploadAvatar,
  firebaseUploadFile,
  firebaseUploadHeaderImage,
} from '../firebase/firebasestorageService';
import { userService } from '../services/userService';
import {
  firebaseGoogleLogin,
  firebaseIsEmailVerified,
  firebaseLoginWithEmail,
  fireBaseRegisterUser,
  firebaseSendVerificationEmail,
  firebaseUpdateEmail,
  firebaseUpdatePassword,
} from '../firebase/firebaseAuthService';

const verifyUserHelper = async (
  dispatch: ThunkDispatch<unknown, unknown, AnyAction>,
  user: IUser
) => {
  const isVerified = await firebaseIsEmailVerified();
  dispatch(setIsVerified(isVerified));
  dispatch(checkCompletedProfile(user));
  dispatch(setAuthUser(user));
};

const fetchProfile = createAsyncThunk(
  'users/fetchProfile',
  async (_, ThunkAPI) => {
    const user = await authService.getProfile();
    verifyUserHelper(ThunkAPI.dispatch, user);
    return user;
  }
);

const register = createAsyncThunk(
  'users/register',
  async (
    {
      email,
      password,
      name,
      username,
    }: { email: string; password: string; name: string; username: string },
    ThunkAPI
  ) => {
    const fbUser = await fireBaseRegisterUser(email, password);
    const newUser = await authService.register({
      email,
      password,
      name,
      username,
      uid: fbUser.uid,
    });
    verifyUserHelper(ThunkAPI.dispatch, newUser);
    return;
  }
);

const verifyEmail = createAsyncThunk(
  'users/verifyEmail',
  async (_, ThunkAPI) => {
    await firebaseSendVerificationEmail();
  }
);

/**
 * Calls the login service and updates state with logged in user.
 * Sets auth token in local storage, and calls sockets listeners.
 */
const login = createAsyncThunk(
  'users/login',
  async (
    { email, password }: { email: string; password: string },
    ThunkAPI
  ) => {
    await firebaseLoginWithEmail(email, password);
    const user = await authService.getProfile();
    verifyUserHelper(ThunkAPI.dispatch, user);
    return user;
  }
);

const loginWithGoogle = createAsyncThunk(
  'users/loginWithGoogle',
  async (_, ThunkAPI) => {
    await firebaseGoogleLogin();
    const user = await authService.getProfile();
    verifyUserHelper(ThunkAPI.dispatch, user);
    return user;
  }
);

const registerWithGoogle = createAsyncThunk(
  'users/registerWithGoogle',
  async (_, ThunkAPI) => {
    const fbUser = await firebaseGoogleLogin();
    const user: Partial<IUser> = {
      uid: fbUser.uid,
      email: fbUser.email || '',
      name: fbUser.displayName || '',
      profilePhoto: fbUser.photoURL || '',
      registeredWithProvider: true,
    };
    const newUser = await authService.register(user);
    verifyUserHelper(ThunkAPI.dispatch, newUser);
    return user;
  }
);

/**
 * Logs the user out by calling the logout service.
 */
const logout = createAsyncThunk('users/logout', async (_: void, ThunkAPI) => {
  clearLocalAuthToken();
  ThunkAPI.dispatch(clearChat());
  ThunkAPI.dispatch(clearUser());
  ThunkAPI.dispatch(clearProfile());
  await authService.logout();
});

const uploadAvatar = createAsyncThunk(
  'users/uploadAvatar',
  async ({ file, path }: { file: File; path: string }, ThunkAPI) => {
    const imageURL = await firebaseUploadFile(path, file);
    return imageURL;
  }
);

/**
 * Calls updateUser service to update user and then update state with the user.
 */
const updateUser = createAsyncThunk(
  'users/update',
  async (
    {
      user,
      profilePhoto,
      headerImage,
    }: { user: IUser; profilePhoto: File | null; headerImage: File | null },
    ThunkAPI
  ) => {
    const state = ThunkAPI.getState() as RootState;
    const existingUser = state.user.data;
    if (user.email && user.email !== existingUser.email) {
      await firebaseUpdateEmail(user.email);
    }
    if (user.password && user.password !== existingUser.password) {
      await firebaseUpdatePassword(user.password);
    }
    if (profilePhoto) {
      const avatarURL = await firebaseUploadAvatar(profilePhoto);
      user.profilePhoto = avatarURL;
    }
    if (headerImage) {
      const headerURL = await firebaseUploadHeaderImage(headerImage);
      user.headerImage = headerURL;
    }
    const updatedUser = await userService.updateUser(user);
    ThunkAPI.dispatch(
      setSuccessAlert({ message: 'Profile updated successfully.' })
    );
    ThunkAPI.dispatch(checkCompletedProfile(updatedUser));
    ThunkAPI.dispatch(setAuthUser(updatedUser));
    return;
  }
);
export interface UserState {
  data: IUser;
  loading: boolean;
  socketConnected: boolean;
  completedSignup: boolean;
  verified: boolean;
  isLoggedIn: boolean;
  notifications: INotification[];
  unreadNotifications: INotification[];
}

const initialUser: IUser = {
  id: '',
  username: '',
  name: '',
  email: '',
  bio: '',
  headerImage: '',
  profilePhoto: '',
  accountType: '',
  registeredWithProvider: false,
};

const initialState: UserState = {
  data: initialUser,
  isLoggedIn: false,
  socketConnected: false,
  completedSignup: false,
  verified: false,
  notifications: [],
  unreadNotifications: [],
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload;
    },
    setAuthUser: (state, action: PayloadAction<IUser>) => {
      state.data = action.payload;
      state.isLoggedIn = true;
    },
    connectSocket: (state) => {
      state.socketConnected = true;
    },
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.data = initialUser;
      state.completedSignup = false;
      state.socketConnected = false;
    },
    updateAuthUser: (state, action: PayloadAction<IUser>) => {
      state.data = { ...state.data, ...action.payload };
    },
    setIsVerified: (state, action: PayloadAction<boolean>) => {
      state.verified = action.payload;
    },
    checkCompletedProfile: (state, action: PayloadAction<IUser>) => {
      const user = action.payload;
      if (!user || !user.username || !user.name || !user.email) {
        state.completedSignup = false;
      } else {
        state.completedSignup = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchProfile.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateUser.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(register.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(register.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(register.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(verifyEmail.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(verifyEmail.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(verifyEmail.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
      // state.data = initialUser;
      // state.profileComplete = false;
    });

    builder.addCase(loginWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithGoogle.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(loginWithGoogle.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(registerWithGoogle.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      registerWithGoogle.fulfilled,
      (state, action: PayloadAction<Partial<IUser>>) => {
        state.data = { ...state.data, ...action.payload };
        state.loading = false;
      }
    );
    builder.addCase(registerWithGoogle.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(uploadAvatar.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      uploadAvatar.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.data.profilePhoto = action.payload;
      }
    );

    builder.addCase(uploadAvatar.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const selectAuthUser = createSelector(
  (state: RootState) => state.user.data,
  (user) => user
);

export const selectAuthUserLoading = createSelector(
  (state: RootState) => state.user.loading,
  (loading) => loading
);

export const selectIsLoggedIn = createSelector(
  (state: RootState) => state.user.isLoggedIn,
  (isLoggedIn) => isLoggedIn
);

export const selectCompletedSignup = createSelector(
  (state: RootState) => state.user,
  (user) => user.isLoggedIn && user.verified && user.completedSignup
);

export const selectIsVerified = createSelector(
  (state: RootState) => state.user,
  (user) => user.verified
);

export const {
  setNotifications,
  setUnreadNotifications,
  clearUser,
  updateAuthUser,
  setAuthUser,
  checkCompletedProfile,
  setIsVerified,
} = userSlice.actions;

// Export async thunks with error handling decorator
export const fetchProfileThunk = fetchProfile;
export const registerThunk = register;
export const loginThunk = login;
export const loginWithGoogleThunk = loginWithGoogle;
export const logoutThunk = logout;
export const updateUserThunk = updateUser;
export const uploadAvatarThunk = uploadAvatar;
export const registerWithGoogleThunk = registerWithGoogle;
export const verifyEmailThunk = verifyEmail;

export default userSlice.reducer;

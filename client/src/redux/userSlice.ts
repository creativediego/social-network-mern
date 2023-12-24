/**
 * Includes redux state management for user actions such as login and update user.
 */
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  isRejectedWithValue,
  PayloadAction,
} from '@reduxjs/toolkit';
import {
  AUTHlogin,
  AUTHloginWithGoogle,
  AUTHlogout,
  AUTHregister,
  getProfile,
} from '../services/authAPI';
import { withErrorHandling } from './reduxErrorHandler';
import {
  clearLocalAuthToken,
  getLocalAuthToken,
} from '../util/tokenManagement';
import * as socketService from './redux-socket-service';
import { IUser } from '../interfaces/IUser';
import { INotification } from '../interfaces/INotification';
import type { RootState } from './store';
import { setSuccessAlert } from './alertSlice';
import { clearProfile } from './profileSlice';
import { clearChat } from './chatSlice';
import { APIupdateUser } from '../services/userAPI';
import { firebaseUploadFile } from '../firebase/firebasestorageAPI';

/**
 * Updates redux state with user profile after calling getProfile from user service.
 */
const fetchProfile = createAsyncThunk(
  'users/fetchProfile',
  async (_, ThunkAPI) => {
    try {
      // When there is no token, return the initial state user.
      const constLocalToken = getLocalAuthToken();
      if (!constLocalToken) {
        return false;
      }
      const profile = await getProfile();
      const profileComplete = isProfileComplete(profile);
      const state = ThunkAPI.getState() as RootState;
      if (!state.user.socketConnected) {
        socketService.enableListeners(ThunkAPI.dispatch);
      }
      return { profile, profileComplete };
    } catch (err) {
      ThunkAPI.dispatch(clearUser());
      throw err; // will be handled by error handler wrapper
    }
  }
);

const register = createAsyncThunk(
  'users/register',
  async (
    { email, password }: { email: string; password: string },
    ThunkAPI
  ) => {
    await AUTHregister(email, password);
    ThunkAPI.dispatch(fetchProfile());
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
    await AUTHlogin(email, password);
    return ThunkAPI.dispatch(fetchProfile());
  }
);

const loginWithGoogle = createAsyncThunk(
  'users/loginWithGoogle',
  async (_, ThunkAPI) => {
    await AUTHloginWithGoogle();
    return ThunkAPI.dispatch(fetchProfile());
  }
);

/**
 * Logs the user out by calling the logout service.
 */
const logout = createAsyncThunk('users/logout', async (_: void, ThunkAPI) => {
  await AUTHlogout();
  clearLocalAuthToken();
  ThunkAPI.dispatch(clearChat());
  ThunkAPI.dispatch(clearUser());
  ThunkAPI.dispatch(clearProfile());
  socketService.disconnect();
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
  async (user: IUser, ThunkAPI) => {
    const updatedUser = await APIupdateUser(user);

    ThunkAPI.dispatch(
      setSuccessAlert({ message: 'Profile updated successfully.' })
    );
    const profileComplete = isProfileComplete(updatedUser);

    return { updatedUser, profileComplete };
  }
);
export interface UserState {
  data: IUser;
  loading: boolean;
  socketConnected: boolean;
  profileComplete: boolean;
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
  profileComplete: false,
  notifications: [],
  unreadNotifications: [],
  loading: false,
};

const isProfileComplete = (user: IUser): boolean => {
  if (!user || !user.username) {
    return false;
  }
  return true;
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
      state.profileComplete = false;
      clearLocalAuthToken();
      AUTHlogout();
      state.socketConnected = false;
    },
    updateAuthUser: (state, action: PayloadAction<IUser>) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchProfile.fulfilled,
      (
        state,
        action: PayloadAction<
          false | { profile: IUser; profileComplete: boolean }
        >
      ) => {
        state.loading = false;
        if (action.payload !== false) {
          state.data = action.payload.profile;
          state.isLoggedIn = true;
          state.socketConnected = true;
          state.profileComplete = action.payload.profileComplete;
        }
      }
    );

    builder.addCase(fetchProfile.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUser.fulfilled,
      (
        state,
        action: PayloadAction<{ updatedUser: IUser; profileComplete: boolean }>
      ) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload.updatedUser };
        state.profileComplete = action.payload.profileComplete;
      }
    );
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

export const selectIsProfileComplete = createSelector(
  (state: RootState) => state.user.profileComplete,
  (profileComplete) => profileComplete
);

export const {
  setNotifications,
  setUnreadNotifications,
  clearUser,
  updateAuthUser,
  setAuthUser,
} = userSlice.actions;

// Export async thunks with error handling decorator
export const fetchProfileThunk = withErrorHandling(fetchProfile);
export const registerThunk = withErrorHandling(register);
export const loginThunk = withErrorHandling(login);
export const loginWithGoogleThunk = withErrorHandling(loginWithGoogle);
export const logoutThunk = withErrorHandling(logout);
export const updateUserThunk = withErrorHandling(updateUser);
export const uploadAvatarThunk = withErrorHandling(uploadAvatar);

export default userSlice.reducer;

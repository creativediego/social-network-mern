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
import { getProfile } from '../services/auth-service';
import { findUserById, updateUser } from '../services/users-service';
import { dataOrStateError } from './helpers';
import { clearToken } from '../services/helpers';
import * as socketService from '../services/socket-service';
import {
  firebaseLoginWithEmail,
  firebaseLogout,
  fireBaseRegisterUser,
  firebaseIsLoggedIn,
  loginWithGoogle,
} from '../services/firebase-auth';
import { setAuthToken } from '../services/helpers';
import { IUser } from '../interfaces/IUser';
import { INotification } from '../interfaces/INotification';
import { RootState } from './store';
import { setGlobalError, setSuccessAlert } from './alertSlice';
import { IAlert } from '../interfaces/IError';
import { setProfileUser } from './profileSlice';

/**
 * Updates redux state with user profile after calling getProfile from user service.
 */
export const fetchProfileThunk = createAsyncThunk(
  'users/fetchProfile',
  async (data, ThunkAPI) => {
    const profile = await getProfile();
    if (!profile.error) {
      socketService.enableListeners(ThunkAPI);
    }
    return dataOrStateError(profile, ThunkAPI);
  }
);

export const registerThunk = createAsyncThunk(
  'users/register',
  async (
    { email, password }: { email: string; password: string },
    ThunkAPI
  ) => {
    if (!email || !password) {
      throw new Error('Email and password required for registration.');
    }
    try {
      await fireBaseRegisterUser(email, password);
    } catch (err: unknown) {
      const error = err as IAlert;
      ThunkAPI.dispatch(setGlobalError({ message: error.message }));
      return ThunkAPI.rejectWithValue({ message: error.message });
    }
    const authUser = await getProfile();
    if (!authUser.error) {
      socketService.enableListeners(ThunkAPI);
    }
    return dataOrStateError(authUser, ThunkAPI);
  }
);

/**
 * Calls the login service and updates state with logged in user.
 * Sets auth token in local storage, and calls sockets listeners.
 */
export const loginThunk = createAsyncThunk(
  'users/login',
  async (
    { email, password }: { email: string; password: string },
    ThunkAPI
  ) => {
    try {
      await firebaseLoginWithEmail(email, password);
    } catch (err: unknown) {
      const error = err as IAlert;
      ThunkAPI.dispatch(setGlobalError({ message: error.message }));
      return ThunkAPI.rejectWithValue({ message: error.message });
    }
    const authUser = await getProfile();
    if (!authUser.error) {
      socketService.enableListeners(ThunkAPI);
    }
    return dataOrStateError(authUser, ThunkAPI);
  }
);

export const loginWithGoogleThunk = createAsyncThunk(
  'users/loginWithGoogle',
  async (user, ThunkAPI) => {
    const profile = await loginWithGoogle();
    if (!profile.error) {
      socketService.enableListeners(ThunkAPI);
    }
    return dataOrStateError(profile, ThunkAPI);
  }
);

/**
 * Logs the user out by calling the logout service.
 */
export const logoutThunk = createAsyncThunk(
  'users/logout',
  async (_: void, ThunkAPI) => {
    clearToken();
    socketService.disconnect();
    clearUser();
    await firebaseLogout();
    return;
  }
);

/**
 * Calls updateUser service to update user and then update state with the user.
 */
export const updateUserThunk = createAsyncThunk(
  'users/update',
  async (user: IUser, ThunkAPI) => {
    let updatedUser = await updateUser(user);
    ThunkAPI.dispatch(
      setSuccessAlert({ message: 'Profile updated successfully.' })
    );
    updatedUser = dataOrStateError(updatedUser, ThunkAPI);
    ThunkAPI.dispatch(setProfileUser(updatedUser));
    return dataOrStateError(updatedUser, ThunkAPI);
  }
);
export interface UserState {
  data: IUser;
  loading: boolean;
  profileComplete: boolean;
  isLoggedIn: boolean;
  notifications: INotification[];
  unreadNotifications: INotification[];
}

const initialUser: IUser = {
  id: '',
  username: '',
  name: '',
  firstName: '',
  email: '',
  bio: '',
  headerImage: '',
  profilePhoto: '',
  accountType: '',
};

const initialState: UserState = {
  data: initialUser,
  isLoggedIn: false,
  profileComplete: false,
  notifications: [],
  unreadNotifications: [],
  loading: false,
};

/**
 * Helper: Checks if the logged in user in state has complete their profile.
 */
const checkProfileComplete = (state: UserState, user: IUser) => {
  if (!user || !user.username || !user.birthday) {
    state.profileComplete = false;
  } else {
    state.profileComplete = true;
  }
  state.data = { ...state.data, ...user };
  return state.data;
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
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    clearUser: (state) => {
      state.data = initialUser;
      state.isLoggedIn = false;
      state.profileComplete = false;
      clearToken();
      firebaseLogout();
    },
    updateAuthUser: (state, action: PayloadAction<IUser>) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchProfileThunk.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.isLoggedIn = true;
        checkProfileComplete(state, action.payload);
      }
    );
    builder.addCase(fetchProfileThunk.rejected, (state) => {
      state.loading = false;
      clearUser();
      firebaseLogout();
    });

    builder.addCase(updateUserThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUserThunk.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.data = { ...state.data, ...action.payload };
        checkProfileComplete(state, action.payload);
      }
    );
    builder.addCase(updateUserThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(registerThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      registerThunk.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        checkProfileComplete(state, action.payload);
      }
    );
    builder.addCase(registerThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      loginThunk.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.isLoggedIn = true;
        checkProfileComplete(state, action.payload);
      }
    );
    builder.addCase(loginThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.loading = false;
      state.data = initialUser;
      state.profileComplete = false;
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      state.loading = false;
      state.data = initialUser;
      state.profileComplete = false;
    });

    builder.addCase(loginWithGoogleThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginWithGoogleThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(loginWithGoogleThunk.rejected, (state) => {
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

export const {
  setNotifications,
  setUnreadNotifications,
  clearUser,
  updateAuthUser,
  setAuthUser,
} = userSlice.actions;
export default userSlice.reducer;

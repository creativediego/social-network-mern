/**
 * Includes redux state management for user actions such as login and update user.
 */
import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { getProfile } from '../services/auth-service';
import { updateUser } from '../services/users-service';
import { dataOrThrowError } from './helpers';
import { clearLocalAuthToken, isError } from '../services/api-helpers';
import * as socketService from './redux-socket-service';
import {
  firebaseLoginWithEmail,
  firebaseLogout,
  fireBaseRegisterUser,
  firebaseGoogleLogin,
} from '../services/firebase-auth';
import { IUser } from '../interfaces/IUser';
import { INotification } from '../interfaces/INotification';
import type { RootState } from './store';
import { setSuccessAlert } from './alertSlice';
import { clearProfile } from './profileSlice';
import { clearChat } from './chatSlice';

/**
 * Updates redux state with user profile after calling getProfile from user service.
 */
export const fetchProfileThunk = createAsyncThunk(
  'users/fetchProfile',
  async (_, ThunkAPI) => {
    const profile = await getProfile();
    console.log(profile);
    const state = ThunkAPI.getState() as RootState;
    // if (!state.user.socketConnected) {
    //   socketService.enableListeners(ThunkAPI.dispatch);
    // }
    return dataOrThrowError(profile, ThunkAPI.dispatch);
  }
);

export const registerThunk = createAsyncThunk(
  'users/register',
  async (
    { email, password }: { email: string; password: string },
    ThunkAPI
  ) => {
    await fireBaseRegisterUser(email, password);
    ThunkAPI.dispatch(fetchProfileThunk());
    return;
  }
);

/**
 * Calls the login service and updates state with logged in user.
 * Sets auth token in local storage, and calls sockets listeners.
 */
export const loginThunk = createAsyncThunk(
  'users/login',
  async ({ email, password }: { email: string; password: string }, _) => {
    await firebaseLoginWithEmail(email, password);
    return;
  }
);

export const loginWithGoogleThunk = createAsyncThunk(
  'users/loginWithGoogle',
  async (_, ThunkAPI) => {
    await firebaseGoogleLogin();
    ThunkAPI.dispatch(fetchProfileThunk());
    return;
  }
);

/**
 * Logs the user out by calling the logout service.
 */
export const logoutThunk = createAsyncThunk(
  'users/logout',
  async (_: void, ThunkAPI) => {
    await firebaseLogout();
    clearLocalAuthToken();
    ThunkAPI.dispatch(clearChat());
    ThunkAPI.dispatch(clearUser());
    ThunkAPI.dispatch(clearProfile());
    socketService.disconnect();
    return;
  }
);

/**
 * Calls updateUser service to update user and then update state with the user.
 */
export const updateUserThunk = createAsyncThunk(
  'users/update',
  async (user: IUser, ThunkAPI) => {
    const updatedUser = await updateUser(user);
    if (!isError(updatedUser)) {
      ThunkAPI.dispatch(
        setSuccessAlert({ message: 'Profile updated successfully.' })
      );
    }
    return dataOrThrowError(updatedUser, ThunkAPI.dispatch);
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
  socketConnected: false,
  profileComplete: false,
  notifications: [],
  unreadNotifications: [],
  loading: false,
};

/**
 * Helper: Checks if the logged in user in state has complete their profile.
 */
const checkProfileComplete = (state: UserState, user: IUser) => {
  if (!user || !user.username) {
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
    connectSocket: (state) => {
      state.socketConnected = true;
    },
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    clearUser: (state) => {
      state.isLoggedIn = false;
      state.data = initialUser;
      firebaseLogout();
      clearLocalAuthToken();
      state.socketConnected = false;
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
        state.data = action.payload;
        state.isLoggedIn = true;
        state.socketConnected = true;
        checkProfileComplete(state, action.payload);
      }
    );

    builder.addCase(fetchProfileThunk.rejected, (state) => {
      state.loading = false;
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
    builder.addCase(registerThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(loginThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(logoutThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.loading = false;
      state.data = initialUser;
      state.isLoggedIn = false;
      state.profileComplete = false;
      clearLocalAuthToken();
      firebaseLogout();
      state.socketConnected = false;
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      state.loading = false;
      // state.data = initialUser;
      // state.profileComplete = false;
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
export default userSlice.reducer;

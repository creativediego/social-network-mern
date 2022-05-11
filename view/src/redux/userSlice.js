/**
 * Includes redux state management for user actions such as login and update user.
 */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { register, getProfile, login } from '../services/auth-service';
import { updateUser } from '../services/users-service';
import { dataOrStateError } from './helpers';
import * as socketService from '../services/socket-service';
import { loginWithGoogle } from '../services/firebase-auth';

/**
 * Updates redux state with user profile after calling getProfile from user service.
 */
export const fetchProfileThunk = createAsyncThunk(
  'users/getProfile',
  async (data, ThunkAPI) => {
    const profile = await getProfile();
    if (!profile.error) {
      socketService.enableListeners(ThunkAPI);
    }
    return dataOrStateError(profile, ThunkAPI);
  }
);

/**
 * Calls the registration service and updates state with registered user.
 */
export const registerThunk = createAsyncThunk(
  'users/register',
  async (user, ThunkAPI) => {
    const res = await register(user);
    return dataOrStateError(res, ThunkAPI);
  }
);

/**
 * Calls the login service and updates state with logged in user.
 * Sets auth token in local storage, and calls sockets listeners.
 */
export const loginThunk = createAsyncThunk(
  'users/login',
  async (user, ThunkAPI) => {
    const res = await login(user);
    localStorage.setItem('token', res.token);
    if (!res.error) {
      socketService.enableListeners(ThunkAPI);
    }
    return dataOrStateError(res, ThunkAPI);
  }
);

export const loginWithGoogleThunk = createAsyncThunk(
  'users/loginWithGoogle',
  async (user, ThunkAPI) => {
    const profile = await loginWithGoogle();
    if (!profile.error) {
      socketService.enableListeners(ThunkAPI);
    }
    console.log('profile', profile);
    return dataOrStateError(profile, ThunkAPI);
  }
);

/**
 * Logs the user out by calling the logout service.
 */
export const logoutThunk = createAsyncThunk(
  'users/logout',
  async (user, ThunkAPI) => {
    localStorage.removeItem('token');
    socketService.disconnect();
    return;
  }
);

/**
 * Calls updateUser service to update user and then update state with the user.
 */
export const updateUserThunk = createAsyncThunk(
  'users/update',
  async (user, ThunkAPI) => {
    console.log('user to be updatesd', user);
    const res = await updateUser(user);
    return dataOrStateError(res, ThunkAPI);
  }
);

/**
 * Checks if the logged in user in state has complete their profile.
 */
const checkProfileComplete = (state, user) => {
  if (!user || (user && !user.username)) {
    state.profileComplete = false;
  } else {
    state.data = user;
    state.profileComplete = true;
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    token: localStorage.getItem('token'),
    loading: false,
    profileComplete: false,
    loggedIn: false,
    notifications: [],
    unreadNotifications: [],
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadNotifications: (state, action) => {
      state.unreadNotifications = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
      state.profileComplete = null;
      state.token = null;
    },
    updateAuthUser: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: {
    [fetchProfileThunk.fulfilled]: (state, action) => {
      state.loading = false;
      if (action.payload.error) return;
      checkProfileComplete(state, action.payload);
    },
    [fetchProfileThunk.rejected]: (state) => {
      state.loading = false;
    },
    [updateUserThunk.pending]: (state) => {
      state.loading = true;
    },
    [updateUserThunk.fulfilled]: (state, action) => {
      state.loading = false;
      checkProfileComplete(state, action.payload);
    },
    [registerThunk.pending]: (state) => {
      state.loading = true;
    },
    [registerThunk.fulfilled]: (state, action) => {
      state.loading = false;
      checkProfileComplete(state, action.payload);
    },
    [loginThunk.pending]: (state) => {
      state.loading = true;
    },
    [loginThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      checkProfileComplete(state, action.payload.user);
    },
    [loginWithGoogleThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [loginWithGoogleThunk.pending]: (state) => {
      state.loading = true;
    },
    [loginWithGoogleThunk.fulfilled]: (state, action) => {
      state.loading = false;
      checkProfileComplete(state, action.payload);
    },
    [loginThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [logoutThunk.pending]: (state) => {
      state.loading = true;
    },
    [logoutThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = null;
      state.profileComplete = false;
    },

    [logoutThunk.rejected]: (state) => {
      state.loading = false;
      state.data = null;
      state.profileComplete = false;
    },
  },
});
export const {
  clearFoundUsers,
  setNotifications,
  setUnreadNotifications,
  clearUser,
  updateAuthUser,
} = userSlice.actions;
export default userSlice.reducer;

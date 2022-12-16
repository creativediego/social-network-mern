import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ITuit } from '../interfaces/ITuit';
import { IUser } from '../interfaces/IUser';
import {
  findAllTuitsDislikedByUser,
  findAllTuitsLikedByUser,
} from '../services/likes-service';
import { findTuitsByUser } from '../services/tuits-service';
import { findUserByUsername } from '../services/users-service';
import { dataOrStateError } from './helpers';
import type { RootState } from './store';

export const findProfileThunk = createAsyncThunk(
  'profile/findProfile',
  async (username: string, ThunkAPI) => {
    const user = await findUserByUsername(username);
    return dataOrStateError(user, ThunkAPI.dispatch);
  }
);

export const findMyTuitsThunk = createAsyncThunk(
  'profile/findMyTuits',
  async (userId: string, ThunkAPI) => {
    const tuits = await findTuitsByUser(userId);
    return dataOrStateError(tuits, ThunkAPI.dispatch);
  }
);

export const findLikedTuitsThunk = createAsyncThunk(
  'profile/findMyLikes',
  async (userId: string, ThunkAPI) => {
    let tuits = await findAllTuitsLikedByUser(userId);
    tuits = tuits.filter((tuit: ITuit) => tuit !== null);
    return dataOrStateError(tuits, ThunkAPI.dispatch);
  }
);

export const findDislikedTuitsThunk = createAsyncThunk(
  'profile/findMydislikes',
  async (userId: string, ThunkAPI) => {
    let tuits = await findAllTuitsDislikedByUser(userId);
    tuits = tuits.filter((tuit: ITuit) => tuit !== null);
    return dataOrStateError(tuits, ThunkAPI.dispatch);
  }
);

interface ProfileState {
  user: IUser | null;
  myTuits: EntityState<ITuit>;
  likes: EntityState<ITuit>;
  dislikes: EntityState<ITuit>;
  loading: boolean;
}

const myTuitsAdapter = createEntityAdapter<ITuit>({
  selectId: (tuit: ITuit) => tuit.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const likedTuitsAdapter = createEntityAdapter<ITuit>({
  selectId: (tuit: ITuit) => tuit.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const dislikedTuitsAdapter = createEntityAdapter<ITuit>({
  selectId: (tuit: ITuit) => tuit.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const initialState: ProfileState = {
  user: null,
  myTuits: myTuitsAdapter.getInitialState(),
  likes: likedTuitsAdapter.getInitialState(),
  dislikes: dislikedTuitsAdapter.getInitialState(),
  loading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateMyTuits: (state, action: PayloadAction<ITuit>) => {
      const existingTuit = myTuitsAdapter
        .getSelectors()
        .selectById(state.myTuits, action.payload.id);
      if (existingTuit) {
        myTuitsAdapter.upsertOne(state.myTuits, action.payload);
      }
    },
    updateLikedTuits: (state, action: PayloadAction<ITuit>) => {
      const existingTuit = likedTuitsAdapter
        .getSelectors()
        .selectById(state.likes, action.payload.id);
      if (existingTuit) {
        likedTuitsAdapter.removeOne(state.likes, action.payload.id);
      } else {
        likedTuitsAdapter.upsertOne(state.likes, action.payload);
      }
    },
    updateDislikedTuits: (state, action: PayloadAction<ITuit>) => {
      const existingTuit = dislikedTuitsAdapter
        .getSelectors()
        .selectById(state.dislikes, action.payload.id);
      if (existingTuit) {
        dislikedTuitsAdapter.removeOne(state.dislikes, action.payload.id);
      } else {
        dislikedTuitsAdapter.upsertOne(state.dislikes, action.payload);
      }
    },
    removeMyTuit: (state, action: PayloadAction<ITuit>) => {
      const existingTuit = myTuitsAdapter
        .getSelectors()
        .selectById(state.myTuits, action.payload.id);
      if (existingTuit) {
        myTuitsAdapter.removeOne(state.myTuits, action.payload.id);
      }
    },
    removeLikedTuit: (state, action: PayloadAction<ITuit>) => {
      const existingTuit = likedTuitsAdapter
        .getSelectors()
        .selectById(state.likes, action.payload.id);
      if (existingTuit) {
        likedTuitsAdapter.removeOne(state.likes, action.payload.id);
      }
    },
    removeDislikedTuit: (state, action: PayloadAction<ITuit>) => {
      const existingTuit = dislikedTuitsAdapter
        .getSelectors()
        .selectById(state.dislikes, action.payload.id);
      if (existingTuit) {
        dislikedTuitsAdapter.removeOne(state.dislikes, action.payload.id);
      }
    },
    setProfileUser: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findProfileThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findProfileThunk.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(findProfileThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findMyTuitsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findMyTuitsThunk.fulfilled,
      (state, action: PayloadAction<ITuit[]>) => {
        state.loading = false;

        myTuitsAdapter.setAll(state.myTuits, action.payload);
      }
    );
    builder.addCase(findMyTuitsThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findLikedTuitsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findLikedTuitsThunk.fulfilled,
      (state, action: PayloadAction<ITuit[]>) => {
        state.loading = false;
        likedTuitsAdapter.setAll(state.likes, action.payload);
      }
    );
    builder.addCase(findLikedTuitsThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(findDislikedTuitsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findDislikedTuitsThunk.fulfilled,
      (state, action: PayloadAction<ITuit[]>) => {
        state.loading = false;
        dislikedTuitsAdapter.setAll(state.dislikes, action.payload);
      }
    );
    builder.addCase(findDislikedTuitsThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const selectProfile = createSelector(
  (state: RootState) => state.profile.user,
  (user) => user
);

export const selectMyTuits = createSelector(
  (state: RootState) =>
    myTuitsAdapter.getSelectors().selectAll(state.profile.myTuits),
  (tuits) => tuits
);

export const selectLikedTuits = createSelector(
  (state: RootState) =>
    likedTuitsAdapter.getSelectors().selectAll(state.profile.likes),
  (likes) => likes
);

export const selectDislikedTuits = createSelector(
  (state: RootState) =>
    dislikedTuitsAdapter.getSelectors().selectAll(state.profile.dislikes),
  (dislikes) => dislikes
);

export const selectProfileLoading = createSelector(
  (state: RootState) => state.profile.loading,
  (loading) => loading
);
export const {
  updateMyTuits,
  updateLikedTuits,
  updateDislikedTuits,
  removeMyTuit,
  removeDislikedTuit,
  removeLikedTuit,
  setProfileUser,
} = profileSlice.actions;
export default profileSlice.reducer;

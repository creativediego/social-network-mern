import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IPost } from '../interfaces/IPost';
import { userDislikesTuit, userLikesTuit } from '../services/likes-service';
import { uploadTuitImage } from '../services/storage-service';
import {
  findAllTuits,
  createTuit,
  deleteTuit,
  updateTuit,
} from '../services/tuits-service';
import { setGlobalError } from './alertSlice';
import { dataOrStateError } from './helpers';
import {
  updateDislikedTuits,
  updateLikedTuits,
  updateMyTuits,
  removeDislikedTuit,
  removeLikedTuit,
  removeMyTuit,
} from './profileSlice';
import type { RootState } from './store';

/**
 * Uses tuits service to update state with all tuits. Also keeps track of loading status of requests.
 */
export const findAllTuitsThunk = createAsyncThunk(
  'tuits/findAllTuits',
  async (data, ThunkAPI) => {
    const tuits = await findAllTuits();
    return dataOrStateError(tuits, ThunkAPI.dispatch);
  }
);

/**
 * Uses tuit service to crate a tuit and then makes another call to fetch all tuits to update state.
 */
export const createTuitThunk = createAsyncThunk(
  'tuits/createTuit',
  async (
    {
      userId,
      tuit,
      imageFile,
    }: { userId: string; tuit: IPost; imageFile: File | null },
    ThunkAPI
  ) => {
    let resultTuit = await createTuit(userId, tuit);
    if (imageFile) {
      try {
        const tuitImageURL = await uploadTuitImage(imageFile, resultTuit.id);
        resultTuit.image = tuitImageURL;
        resultTuit = await updateTuit(resultTuit.id, resultTuit);
      } catch (err) {
        ThunkAPI.dispatch(
          setGlobalError({
            code: 500,
            message: 'Error uploading tuit image. Try again later.',
          })
        );
      }
    }
    return resultTuit;
  }
);

/**
 * Uses tuit service to delete a tuit and then makes another call to fetch all tuits to update state.
 */
export const deleteTuitThunk = createAsyncThunk(
  'tuits/deleteTuit',
  async (tuitId: string, ThunkAPI) => {
    const deletedTuit = await deleteTuit(tuitId);
    if (!deletedTuit.error) {
      ThunkAPI.dispatch(removeTuit(tuitId));
      ThunkAPI.dispatch(removeMyTuit(deletedTuit));
      ThunkAPI.dispatch(removeLikedTuit(deletedTuit));
      ThunkAPI.dispatch(removeDislikedTuit(deletedTuit));
    }
    return dataOrStateError(deletedTuit, ThunkAPI.dispatch);
  }
);

export const userLikesTuitThunk = createAsyncThunk(
  'tuits/userLikesTuit',
  async (tuitId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const likedTuit = await userLikesTuit(userId, tuitId);
    ThunkAPI.dispatch(updateLikedTuits(likedTuit));
    ThunkAPI.dispatch(updateMyTuits(likedTuit));
    return dataOrStateError(likedTuit, ThunkAPI.dispatch);
  }
);

export const userDislikesTuitThunk = createAsyncThunk(
  'tuits/userDislikesTuit',
  async (tuitId: string, ThunkAPI) => {
    const state = ThunkAPI.getState() as RootState;
    const userId = state.user.data.id;
    const dislikedTuit = await userDislikesTuit(userId, tuitId);
    ThunkAPI.dispatch(updateDislikedTuits(dislikedTuit));
    ThunkAPI.dispatch(updateMyTuits(dislikedTuit));
    return dataOrStateError(dislikedTuit, ThunkAPI.dispatch);
  }
);

export interface TuitsState {
  byAllUsers: IPost[];
  loading: boolean;
}

const tuitsAdapter = createEntityAdapter<IPost>({
  selectId: (tuit: IPost) => tuit.id,
  sortComparer: (a, b) => b.createdAt.localeCompare(a.createdAt),
});

const tuitSlice = createSlice({
  name: 'tuits',
  initialState: tuitsAdapter.getInitialState({ loading: false }),
  reducers: {
    addTuit: tuitsAdapter.upsertOne,
    removeTuit: (state, action) => {
      tuitsAdapter.removeOne(state, action.payload);
    },
    updateTuits: (state, action) => {
      console.log('update a tuit', action.payload);
      tuitsAdapter.updateOne(state, action.payload);
    },
    removeAllTuits: (state) => {
      tuitsAdapter.removeAll(state);
    },
    selectTuit: (state, action) => {
      tuitsAdapter.setOne(state, action.payload);
    },
    setAllTuits: (state, action: PayloadAction<IPost[]>) => {
      tuitsAdapter.setAll(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findAllTuitsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findAllTuitsThunk.fulfilled,
      (state, action: PayloadAction<IPost[]>) => {
        state.loading = false;
        tuitsAdapter.setAll(state, action.payload);
      }
    );
    builder.addCase(findAllTuitsThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(createTuitThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      createTuitThunk.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        tuitsAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(createTuitThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteTuitThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTuitThunk.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteTuitThunk.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(
      userLikesTuitThunk.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        tuitsAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(userLikesTuitThunk.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(
      userDislikesTuitThunk.fulfilled,
      (state, action: PayloadAction<IPost>) => {
        state.loading = false;
        tuitsAdapter.upsertOne(state, action.payload);
      }
    );
    builder.addCase(userDislikesTuitThunk.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const selectTuitsLoading = createSelector(
  (state: RootState) => state.tuits.loading,
  (loading) => loading
);

export const selectAllTuits = createSelector(
  (state: RootState) => tuitsAdapter.getSelectors().selectAll(state.tuits),
  (tuits) => tuits
);

export const {
  removeAllTuits,
  removeTuit,
  updateTuits,
  addTuit,
  selectTuit,
  setAllTuits,
} = tuitSlice.actions;
export default tuitSlice.reducer;

import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ITuit } from '../interfaces/ITuit';
import { uploadTuitImage } from '../services/storage-service';
import {
  findAllTuits,
  createTuit,
  deleteTuit,
  updateTuit,
} from '../services/tuits-service';
import { setGlobalError } from './errorSlice';
import { dataOrStateError } from './helpers';
import { RootState } from './store';

/**
 * Uses tuits service to update state with all tuits. Also keeps track of loading status of requests.
 */
export const findAllTuitsThunk = createAsyncThunk(
  'tuits/findAllTuits',
  async (data, ThunkAPI) => {
    const tuits = await findAllTuits();
    return dataOrStateError(tuits, ThunkAPI);
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
    }: { userId: string; tuit: ITuit; imageFile: File | null },
    ThunkAPI
  ) => {
    let tuitToUpload = { ...tuit };
    let resultTuit = await createTuit(userId, tuitToUpload);
    if (tuit.image && imageFile) {
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
    const deletedTuitCount = await deleteTuit(tuitId);
    if (!deletedTuitCount.error) {
      ThunkAPI.dispatch(removeTuit(tuitId));
    }
    return dataOrStateError(deletedTuitCount, ThunkAPI);
  }
);
export interface TuitsState {
  byAllUsers: ITuit[];
  loading: boolean;
}

const tuitsAdapter = createEntityAdapter<ITuit>({
  selectId: (tuit: ITuit) => tuit.id,
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
      tuitsAdapter.updateMany(state, action.payload);
    },
    removeAllTuits: (state) => {
      tuitsAdapter.removeAll(state);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findAllTuitsThunk.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      findAllTuitsThunk.fulfilled,
      (state, action: PayloadAction<ITuit[]>) => {
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
    builder.addCase(createTuitThunk.fulfilled, (state) => {
      state.loading = false;
    });
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
  },
});

export const tuitsLoadingSelector = createSelector(
  (state: RootState) => state.tuits.loading,
  (loading) => loading
);

export const { selectAll: selectAllTuits, selectById: selectTuitById } =
  tuitsAdapter.getSelectors((state: RootState) => state.tuits);
export const { removeAllTuits, removeTuit, updateTuits, addTuit } =
  tuitSlice.actions;
export default tuitSlice.reducer;

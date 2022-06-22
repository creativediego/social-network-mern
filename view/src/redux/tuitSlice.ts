import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
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
  async ({ userId, tuit }: { userId: string; tuit: ITuit }, ThunkAPI) => {
    let tuitToUpload = { ...tuit };
    delete tuitToUpload.imageFile;
    let resultTuit = await createTuit(userId, tuitToUpload);
    if (tuit.image && tuit.imageFile) {
      try {
        const tuitImageURL = await uploadTuitImage(
          tuit.imageFile,
          resultTuit.id
        );
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
      ThunkAPI.dispatch(removeTuits(tuitId));
    }
    return dataOrStateError(deletedTuitCount, ThunkAPI);
  }
);
export interface TuitsState {
  list: ITuit[];
  loading: boolean;
}
const initialState: TuitsState = {
  list: [],
  loading: false,
};
const tuitSlice = createSlice({
  name: 'tuits',
  initialState,
  reducers: {
    setTuits: (state, action) => {
      state.list = action.payload;
    },
    removeTuits: (state, action) => {
      state.list = state.list.filter((tuit) => tuit.id !== action.payload);
    },
    updateTuits: (state, action) => {
      const incomingTuit = action.payload;
      const updatedList = state.list.map((tuit) => {
        if (tuit.id === incomingTuit.id) {
          return { ...tuit, ...incomingTuit };
        }
        return tuit;
      });
      state.list = updatedList;
    },
    pushTuit: (state, action) => {
      const incomingTuit = action.payload;
      state.list.unshift(incomingTuit);
    },
    clearTuits: (state) => {
      state.list = [];
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
        state.list = action.payload;
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
export const { setTuits, clearTuits, removeTuits, updateTuits, pushTuit } =
  tuitSlice.actions;
export default tuitSlice.reducer;

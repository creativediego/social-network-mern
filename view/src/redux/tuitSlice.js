import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { increment } from 'firebase/firestore';
import { list } from 'firebase/storage';
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
  async ({ userId, tuit }, ThunkAPI) => {
    let tuitToUpload = { ...tuit };
    delete tuitToUpload.imageFile;
    let resultTuit = await createTuit(userId, tuitToUpload);
    if (tuit.image) {
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
            error: 'Error uploading tuit image. Try again later.',
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
  async (tuitId, ThunkAPI) => {
    const deletedTuitCount = await deleteTuit(tuitId);
    if (!deletedTuitCount.error) {
      ThunkAPI.dispatch(removeTuits(tuitId));
    }
    return dataOrStateError(deletedTuitCount, ThunkAPI);
  }
);

const tuitSlice = createSlice({
  name: 'tuits',
  initialState: {
    list: [],
    loading: false,
  },
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
  extraReducers: {
    // for the async thunks
    [findAllTuitsThunk.pending]: (state) => {
      state.loading = true;
    },
    [findAllTuitsThunk.fulfilled]: (state, action) => {
      state.loading = false;
      state.list = [...action.payload];
    },
    [findAllTuitsThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [createTuitThunk.pending]: (state) => {
      state.loading = true;
    },
    [createTuitThunk.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [createTuitThunk.rejected]: (state, action) => {
      state.loading = false;
    },
    [deleteTuitThunk.pending]: (state) => {
      state.loading = true;
    },
    [deleteTuitThunk.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [deleteTuitThunk.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
export const { setTuits, clearTuits, removeTuits, updateTuits, pushTuit } =
  tuitSlice.actions;
export default tuitSlice.reducer;

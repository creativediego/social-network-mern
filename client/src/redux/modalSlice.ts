/**
 * This module defines the modal slice of the Redux store for managing modal dialogs in the application.
 *
 * The modal slice of the store has several properties: `isOpen`, `title`, `content`, `actionLabel`, and `confirm`.
 *
 * - `isOpen`: A boolean indicating whether the modal is currently open.
 *
 * - `title`: The title of the modal.
 *
 * - `content`: The content of the modal.
 *
 * - `actionLabel`: The label of the action button in the modal.
 *
 * - `confirm`: A boolean indicating whether the modal is a confirmation modal.
 *
 * The `openModal`, `closeModal`, and `confirmModal` actions are used to control the state of the modal.
 *
 * @module modalSlice
 * @see {@link createSlice} for the function that generates the slice.
 * @see {@link PayloadAction} for the type of all dispatched actions.
 * @see {@link RootState} for the type of the root state.
 */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
  actionLabel: string;
  confirm: boolean;
}

const initialState: ModalState = {
  isOpen: false,
  title: '',
  content: '',
  actionLabel: '',
  confirm: false,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{
        title: string;
        content: string;
        actionLabel: string;
      }>
    ) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.content = action.payload.content;
      state.actionLabel = action.payload.actionLabel;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = '';
      state.content = '';
      state.actionLabel = '';
      state.confirm = false;
    },
    confirmModal: (state) => {
      state.confirm = true;
    },
  },
});

export const { openModal, closeModal, confirmModal } = modalSlice.actions;

export const selectModal = (state: RootState) => state.modal;
export const selectConfirmModal = (state: RootState) => state.modal.confirm;

export default modalSlice.reducer;

// modalSlice.ts
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
      console.log('close modal reducer triggered');
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

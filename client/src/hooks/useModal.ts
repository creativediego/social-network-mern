import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectModal,
  closeModal as closeModalReducer,
  confirmModal as confirmModalReducer,
} from '../redux/modalSlice';

/**
 * `useModal` is a custom hook that provides the current modal state and functions to handle the modal.
 * It uses the `useAppSelector` hook to get the current modal state from the Redux store.
 * It also uses the `useAppDispatch` hook to get the dispatch function from the Redux store.
 * The `handleCloseModal` function is used to dispatch the `closeModalReducer` action to the Redux store.
 * The `confirmModal` function is used to dispatch the `confirmModalReducer` action to the Redux store.
 *
 * @returns {Object} The state and functions related to the modal.
 * @property {IModalState} modal - The current modal state.
 * @property {() => void} handleCloseModal - The function to close the modal.
 * @property {() => void} confirmModal - The function to confirm the modal.
 *
 * @example
 * const { modal, handleCloseModal, confirmModal } = useModal();
 *
 * @see {@link useAppSelector} for the hook that selects state from the Redux store.
 * @see {@link useAppDispatch} for the hook that dispatches actions to the Redux store.
 */

export const useModal = () => {
  const modal = useAppSelector(selectModal);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => dispatch(closeModalReducer());

  const confirmModal = () => dispatch(confirmModalReducer());

  return { modal, handleCloseModal, confirmModal };
};

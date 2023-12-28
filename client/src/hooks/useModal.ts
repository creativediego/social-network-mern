import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  selectModal,
  closeModal as closeModalReducer,
  confirmModal as confirmModalReducer,
} from '../redux/modalSlice';

export const useModal = () => {
  const modal = useAppSelector(selectModal);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => dispatch(closeModalReducer());

  const confirmModal = () => dispatch(confirmModalReducer());

  return { modal, handleCloseModal, confirmModal };
};

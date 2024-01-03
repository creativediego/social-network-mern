import { useCallback } from 'react';
import { IMessage } from '../../../interfaces/IMessage';
import { useAppDispatch } from '../../../redux/hooks';
import { deleteMessageThunk } from '../../../redux/chatSlice';

const useMessageOptions = (message: IMessage) => {
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(
    async () => dispatch(deleteMessageThunk(message)),
    [dispatch, message]
  );

  return { handleDelete };
};

export default useMessageOptions;

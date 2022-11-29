import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  loginThunk,
  selectAuthUser,
  selectAuthUserLoading,
} from '../redux/userSlice';
import { logoutThunk } from '../redux/userSlice';

export const useAuthUser = () => {
  const user = useAppSelector(selectAuthUser);
  const loading = useAppSelector(selectAuthUserLoading);
  const dispatch = useAppDispatch();
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      return;
    }
    dispatch(loginThunk({ email, password }));
  };
  const logout = async () => {
    dispatch(logoutThunk());
  };

  return {
    user,
    logout,
    login,
    loading,
  };
};

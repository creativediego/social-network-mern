import { renderHook, act } from '@testing-library/react-hooks';
import { useAuthUser } from './useAuthUser';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import {
  fetchProfileThunk,
  loginThunk,
  selectAuthUser,
  selectAuthUserLoading,
  selectIsLoggedIn,
  selectIsProfileComplete,
  logoutThunk,
} from '../redux/userSlice';

jest.mock('../redux/hooks');
jest.mock('../redux/userSlice');

describe('useAuthUser', () => {
  const mockedUseAppSelector = useAppSelector as jest.Mock;
  const mockedUseAppDispatch = useAppDispatch as jest.Mock;

  beforeEach(() => {
    mockedUseAppSelector.mockReset();
    mockedUseAppDispatch.mockReset();
  });

  test('should update loginUser state when handleSetLoginUser is called', () => {
    const { result } = renderHook(() => useAuthUser());

    const email = 'test@example.com';
    const password = 'password';
    const inputEvent = {
      currentTarget: {
        name: 'email',
        value: email,
      },
    } as React.FormEvent<HTMLInputElement>;

    act(() => {
      result.current.handleSetLoginUser(inputEvent);
    });

    expect(result.current.loginUser.email).toBe(email);
    expect(result.current.loginUser.password).toBe('');

    act(() => {
      inputEvent.currentTarget.name = 'password';
      inputEvent.currentTarget.value = password;
      result.current.handleSetLoginUser(inputEvent);
    });

    expect(result.current.loginUser.email).toBe(email);
    expect(result.current.loginUser.password).toBe(password);
  });

  test('should call loginThunk and fetchProfileThunk when login is called with valid email and password', async () => {
    const { result } = renderHook(() => useAuthUser());
    const email = 'test@example.com';
    const password = 'TestPassword123!';
    result.current.loginUser = { email, password };

    await act(async () => {
      await result.current.login();
    });

    expect(mockedUseAppDispatch).toHaveBeenCalledWith(
      loginThunk({ email, password })
    );
    expect(mockedUseAppDispatch).toHaveBeenCalledWith(fetchProfileThunk());
  });

  test('should not call loginThunk or fetchProfileThunk when login is called with empty email or password', async () => {
    const { result } = renderHook(() => useAuthUser());
    const email = '';
    const password = 'password';
    result.current.loginUser = { email, password };

    await act(async () => {
      await result.current.login();
    });

    expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(
      loginThunk({ email, password })
    );
    expect(mockedUseAppDispatch).not.toHaveBeenCalledWith(fetchProfileThunk());
  });

  test('should call logoutThunk when logout is called', async () => {
    const { result } = renderHook(() => useAuthUser());

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedUseAppDispatch).toHaveBeenCalledWith(logoutThunk());
  });

  test('should return correct values for user, profileComplete, isLoggedIn, and loading', () => {
    const { result } = renderHook(() => useAuthUser());
    const user = { id: 1, name: 'John Doe' };
    const profileComplete = true;
    const isLoggedIn = true;
    const loading = false;

    mockedUseAppSelector.mockReturnValueOnce(user);
    mockedUseAppSelector.mockReturnValueOnce(profileComplete);
    mockedUseAppSelector.mockReturnValueOnce(isLoggedIn);
    mockedUseAppSelector.mockReturnValueOnce(loading);

    expect(result.current.user).toBe(user);
    expect(result.current.profileComplete).toBe(profileComplete);
    expect(result.current.isLoggedIn).toBe(isLoggedIn);
    expect(result.current.loading).toBe(loading);
  });
});

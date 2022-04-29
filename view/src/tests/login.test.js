/* eslint-disable testing-library/no-unnecessary-act */
import { Provider } from 'react-redux';
import { LoginView } from '../views';
import { render, fireEvent, screen, within } from '@testing-library/react';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as userSlice from '../redux/userSlice';
import * as redux from 'react-redux';

describe('Login', () => {
  let store;
  beforeAll(() => {
    const initialState = { user: { loading: false }, error: { data: null } };
    const middleware = [thunk];
    const mockStore = configureStore(middleware);
    store = mockStore(initialState);
  });

  beforeEach(() => {
    const mockDispatch = jest.spyOn(redux, 'useDispatch');
    mockDispatch.mockImplementation(() => (func) => func);

    const mockLoginThunk = jest.spyOn(userSlice, 'loginThunk');
    mockLoginThunk.mockImplementation(() => console.log('mock called'));
  });

  const setup = () => {
    render(
      // redux provider required by component
      <Provider store={store}>
        <LoginView />
      </Provider>
    );
  };
  test('makes api call with proper params', async () => {
    setup();

    const loginForm = screen.getByTestId('login-form');
    const submitButton = within(loginForm).getByRole('button');

    const userInput = screen.getByTestId('login-user');
    const passwordInput = screen.getByTestId('login-password');

    fireEvent.change(userInput, { target: { value: 'superman' } });
    fireEvent.change(passwordInput, { target: { value: 'Superman123!' } });
    fireEvent.click(submitButton);

    expect(userSlice.loginThunk).toHaveBeenCalledTimes(1);
    expect(userSlice.loginThunk).toHaveBeenCalledWith({
      username: 'superman',
      password: 'Superman123!',
    });
  });
});

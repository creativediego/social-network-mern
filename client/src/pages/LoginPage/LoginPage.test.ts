import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  RenderResult,
  getByText,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from '../../pages';
import { useAlert } from '../../hooks/useAlert';
import { useAuthUser } from '../../hooks/useAuthUser';
import { AlertBox } from '../../components';
import { SignupForm, LoginForm } from '../../forms';

jest.mock('../../hooks/useAlert');
jest.mock('../../hooks/useAuthUser');

describe('LoginPage component', () => {
  beforeEach(() => {
    (useAlert as jest.Mock).mockReturnValue({ error: null });
    (useAuthUser as jest.Mock).mockReturnValue({
      error: null,
      loginWithGoogle: jest.fn(),
      isLoggedIn: false,
      isVerified: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders login page elements', () => {
    const { getByText }: RenderResult = render(<LoginPage />);

    expect(getByText('Join today')).toBeInTheDocument();
    expect(getByText('Already have an account?')).toBeInTheDocument();
    expect(getByText('Login with Google')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('displays error message if there is one', () => {
    (useAlert as jest.Mock).mockReturnValue({
      error: { message: 'Test error' },
    });

    const { getByText } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(getByText('Test error')).toBeInTheDocument();
  });

  it('redirects to /verify-email if user is logged in but not verified', async () => {
    (useAuthUser as jest.Mock).mockReturnValue({
      isLoggedIn: true,
      isVerified: false,
    });
    const { history } = render(
      <MemoryRouter initialEntries={['/login']}>
        <LoginPage />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(history.location.pathname).toEqual('/verify-email')
    );
  });

  it('calls loginWithGoogle when Google login button is clicked', () => {
    const loginWithGoogleMock = jest.fn();
    (useAuthUser as jest.Mock).mockReturnValue({
      loginWithGoogle: loginWithGoogleMock,
    });

    const { getByText } = render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Login with Google'));
    expect(loginWithGoogleMock).toHaveBeenCalled();
  });
});

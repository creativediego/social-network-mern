import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { HashRouter } from 'react-router-dom';

import {
  vi,
  Mock,
  beforeEach,
  afterEach,
  afterAll,
  MockInstance,
} from 'vitest';
import { useAuthUser } from '../../hooks/useAuthUser';

let mockLoginWithGoogle: MockInstance;
describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.doMock('../../hooks/useAlert', () => {
      return {
        useAlert: vi.fn().mockReturnValue({ error: { message: null } }),
      };
    });
    vi.doMock('../../hooks/useAuthUser', () => {
      return {
        useAuthUser: vi.fn().mockReturnValue({
          loginWithGoogle: mockLoginWithGoogle,
          isLoggedIn: false,
          isVerified: false,
        }),
      };
    });
    vi.mock('../../forms/SignupForm/SignupForm', () => ({
      default: vi.fn().mockReturnValue(<div>Sign up Form Mock Component</div>),
    }));
    vi.mock('../../forms/LoginForm/LoginForm', () => ({
      default: vi.fn().mockReturnValue(<div>Log in Form Mock Component</div>),
    }));
  });

  afterEach(() => {
    vi.resetModules();
  });

  it('renders login page with correct elements', async () => {
    const { useAlert } = await import('../../hooks/useAlert');
    const { LoginPage } = await import('../../pages');
    const { getByText, getByRole, queryByText } = render(
      <HashRouter>
        <LoginPage />
      </HashRouter>
    );
    expect(getByText('Join today')).toBeVisible();
    expect(getByText('Already have an account?')).toBeVisible();
    expect(getByText('Sign up Form Mock Component')).toBeVisible();
    expect(getByText('Log in Form Mock Component')).toBeVisible();
    expect(queryByText('test error message')).not.toBeInTheDocument();

    const googleLoginButton = getByRole('button', {
      name: 'Log in with Google',
    });
    expect(googleLoginButton).toBeVisible();
  });

  it('calls loginWithGoogle when Google login button is clicked', async () => {
    mockLoginWithGoogle = vi.fn();
    const { LoginPage } = await import('../../pages');
    const { getByText } = render(
      <HashRouter>
        <LoginPage />
      </HashRouter>
    );
    fireEvent.click(getByText('Log in with Google'));
    expect(mockLoginWithGoogle).toHaveBeenCalled();
  });

  it('displays error message if there is any', async () => {
    vi.doMock('../../hooks/useAlert', () => {
      return {
        useAlert: vi
          .fn()
          .mockReturnValue({ error: { message: 'test error message' } }),
      };
    });
    const { LoginPage } = await import('../../pages');

    const { queryByText } = render(
      <HashRouter>
        <LoginPage />
      </HashRouter>
    );

    expect(queryByText('test error message')).toBeVisible();
  });
});

// it('redirects to verify email page if user is logged in but not verified', async () => {
//   (useAuthUser as vi.Mock).mockReturnValue({
//     loginWithGoogle: vi.fn(),
//     isLoggedIn: true,
//     isVerified: false,
//   });

//   render(<LoginPage />);

//   await waitFor(() => {
//     expect(window.location.pathname).toBe('/verify-email');
//   });
// });

// function renderWithRouter(ui: JSX.Element, { route = '/' } = {}) {
//   window.history.pushState({}, 'Test page', route);

//   return {
//     ...render(ui),
//     history: window.history,
//   };
// }

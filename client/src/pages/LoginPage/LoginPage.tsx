import React from 'react';
import { AlertBox } from '../../components';
import { SignupForm, LoginForm } from '../../forms';
import { useAlert } from '../../hooks/useAlert';
import AppConfig from '../../config';
import { useAuthUser } from '../../hooks/useAuthUser';

/**
 * `LoginPage` is a component that displays the login page.
 *
 * It uses the `useAlert` hook to display any error messages.
 * It also uses the loginWithGoogle from useAuthUser hook for Google login.
 *
 * @component
 * @example
 * Example usage of LoginPage component
 * <LoginPage />
 *
 * @returns {JSX.Element} A JSX element representing the login page.
 */
const LoginPage = (): JSX.Element => {
  const { error } = useAlert();
  const { loginWithGoogle } = useAuthUser();

  return (
    <div>
      <h1 className='fs-1'>{AppConfig.brand.appName}</h1>
      <h2 className='fs-3'>{AppConfig.brand.slogan}</h2>
      <div className='col-md-7'>
        <div className='mt-3'>
          <h3 className='fs-5'>Join today</h3>
          <SignupForm />
        </div>
        <hr />

        <div className='mt-4'>
          <h2 className='fs-6'>Already have an account?</h2>
          <LoginForm />
        </div>

        <div className='d-flex justify-content-between mt-3'>
          <div
            className='btn btn-light rounded-pill w-100'
            onClick={loginWithGoogle}
          >
            <i className='fa-brands fa-google'></i> Login with Google
          </div>
        </div>
      </div>
      {error && <AlertBox message={error.message} />}
    </div>
  );
};

export default LoginPage;

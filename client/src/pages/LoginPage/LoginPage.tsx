import React from 'react';
import { AlertBox } from '../../components';
import { SignupForm, LoginForm } from '../../forms';
import { useAppDispatch } from '../../redux/hooks';
import { loginWithGoogleThunk } from '../../redux/userSlice';
import { useAlert } from '../../hooks/useAlert';
import AppConfig from '../../config';

const LoginPage = () => {
  const { error } = useAlert();
  const dispatch = useAppDispatch();

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
            onClick={() => dispatch(loginWithGoogleThunk())}
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

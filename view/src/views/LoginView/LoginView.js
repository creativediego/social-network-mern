import React from 'react';
import { SignupForm } from '../../forms';
import { LoginForm } from '../../forms';
import { useDispatch, useSelector } from 'react-redux';
import { AlertBox } from '../../components';
import { loginWithGoogleThunk } from '../../redux/userSlice';

const LoginView = () => {
  const error = useSelector((state) => state.error.data);
  const dispatch = useDispatch();

  return (
    <div>
      <h1 className='fs-1'>Happening Now</h1>
      <div className='col-md-7'>
        <div className='mt-3'>
          <h5>Join Tuiter Today</h5>
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

        {error && <AlertBox message={error} />}
      </div>
    </div>
  );
};

export default LoginView;

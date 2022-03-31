import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../redux/userSlice';

import { Loader } from '../../components';

const LoginForm = () => {
  const loading = useSelector((state) => state.user.loading);
  const [loginUser, setLoginUser] = useState({ username: '', password: '' });
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    if (!loginUser || !loginUser.password || !loginUser.username) {
      return;
    }
    dispatch(loginThunk(loginUser));
  };
  return (
    <form>
      <h5>Login</h5>
      <input
        className='mb-2 form-control'
        onChange={(e) =>
          setLoginUser({ ...loginUser, username: e.target.value })
        }
        placeholder='email or username'
        value={loginUser.username}
      />
      <input
        className='mb-2 form-control'
        onChange={(e) =>
          setLoginUser({ ...loginUser, password: e.target.value })
        }
        placeholder='password'
        type='password'
        value={loginUser.password}
      />
      <button
        type='submit'
        onClick={(e) => submit(e)}
        className='btn btn-primary mb-5'
      >
        <Loader loading={loading} content='Sign in' />
      </button>
    </form>
  );
};

export default LoginForm;

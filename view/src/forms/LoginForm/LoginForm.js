import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk } from '../../redux/userSlice';
import { Button } from 'react-bootstrap';
import { Loader, PopupModal } from '../../components';
import FormInput from '../FormInput/FormInput';

/**
 * User login form that uses a redux async loginThunk to log user in. Displays loading button when login in being processed.
 */
const LoginForm = () => {
  const loading = useSelector((state) => state.user.loading);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUser, setLoginUser] = useState({
    email: 'createideas@hotmail.com',
    password: 'Hello123!',
  });
  const dispatch = useDispatch();

  const submit = async () => {
    if (!loginUser || !loginUser.password || !loginUser.email) {
      return;
    }
    dispatch(loginThunk(loginUser));
  };

  const form = (
    <form data-testid='login-form'>
      <FormInput
        dataTestId='login-user'
        placeholder='email'
        value={loginUser.email}
        onChange={(e) => setLoginUser({ ...loginUser, email: e.target.value })}
      />
      <FormInput
        type='password'
        dataTestId='login-password'
        placeholder='password'
        value={loginUser.password}
        onChange={(e) =>
          setLoginUser({ ...loginUser, password: e.target.value })
        }
      />
    </form>
  );

  const loginModalProps = {
    content: {
      size: 'md',
      title: 'Login with email or username',
      body: form,
      submitLabel: 'Login',
    },
    handleSubmit: () => submit(),
    show: showLoginModal,
    setShow: setShowLoginModal,
  };
  return (
    <div>
      <Button
        className='rounded-pill w-100'
        variant='light'
        onClick={() => setShowLoginModal(true)}
      >
        Login with email or username
      </Button>
      <PopupModal props={loginModalProps} />
    </div>
  );
};

export default LoginForm;

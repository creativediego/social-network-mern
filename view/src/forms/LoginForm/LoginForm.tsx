import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginThunk } from '../../redux/userSlice';
import { Button } from 'react-bootstrap';
import { AlertBox, Loader, PopupModal } from '../../components';
import FormInput from '../FormInput/FormInput';
import { profileFields } from '../shared/profileFields';
import { useAppSelector } from '../../redux/hooks';

/**
 * User login form that uses a redux async loginThunk to log user in. Displays loading button when login in being processed.
 */
const LoginForm = (): JSX.Element => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const loading = useAppSelector((state) => state.user.loading);
  const error = useAppSelector((state) => state.error.message);
  const [loginUser, setLoginUser] = useState({
    email: 'createideas@hotmail.com',
    password: 'Hello123!',
  });
  const dispatch = useDispatch();

  const submit = async () => {
    if (!loginUser || !loginUser.password || !loginUser.email) {
      return;
    }
    dispatch(
      loginThunk({ email: loginUser.email, password: loginUser.password })
    );
  };

  return (
    <div>
      <form>
        <FormInput
          {...profileFields['email']}
          dataTestId='login-user'
          placeholder='email'
          value={loginUser.email}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            setLoginUser({ ...loginUser, email: e.currentTarget.value })
          }
        />
        <FormInput
          {...profileFields['password']}
          pattern=''
          type='password'
          dataTestId='login-password'
          placeholder='password'
          value={loginUser.password}
          onChange={(e) =>
            setLoginUser({ ...loginUser, password: e.currentTarget.value })
          }
        />
      </form>
      <span className='fa-pull-right mt-2'>
        <Button
          type='submit'
          className='rounded-pill'
          variant='primary'
          onClick={() => {
            submit();
          }}
        >
          {loading ? <Loader loading={loading} /> : <>Log in</>}
        </Button>
      </span>
      <AlertBox message={error} />
    </div>
  );
};

export default LoginForm;

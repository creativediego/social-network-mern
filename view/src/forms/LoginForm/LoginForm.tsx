import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { AlertBox, Loader } from '../../components';
import FormInput from '../FormInput/FormInput';
import { profileFields } from '../shared/profileFields';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useAlert } from '../../hooks/useAlert';

/**
 * User login form that uses a redux async loginThunk to log user in. Displays loading button when login in being processed.
 */
const LoginForm = (): JSX.Element => {
  const { error } = useAlert();
  const { login, loading } = useAuthUser();

  const [loginUser, setLoginUser] = useState({
    email: 'createideas@hotmail.com',
    password: 'Hello123!',
  });

  const submit = () => {
    login(loginUser.email, loginUser.password);
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
      <AlertBox message={error.message} />
    </div>
  );
};

export default LoginForm;

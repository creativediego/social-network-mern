import React from 'react';
import { Button } from 'react-bootstrap';
import { AlertBox, Loader } from '../../components';
import FormInput from '../FormInput/FormInput';
import { profileFieldsStore } from '../shared/profileFieldsStore';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useAlert } from '../../hooks/useAlert';

/**
 * User login form component: Displays loading button when login in being processed. Displays error message if login fails. Uses useAuthUser hook to manage login state. Uses useAlert hook to display error message. Uses FormInput component to display form inputs. Uses profileFields to display form input fields.
 */
const LoginForm = (): JSX.Element => {
  const { error } = useAlert();
  const { login, loading, handleSetLoginUser, loginUser } = useAuthUser();

  return (
    <div>
      <form>
        <FormInput
          {...profileFieldsStore['email']}
          dataTestId='login-user'
          placeholder='email'
          value={loginUser.email}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            handleSetLoginUser(e)
          }
        />
        <FormInput
          {...profileFieldsStore['password']}
          pattern=''
          type='password'
          dataTestId='login-password'
          placeholder='password'
          value={loginUser.password}
          onChange={(e) => handleSetLoginUser(e)}
        />
      </form>
      <span className='fa-pull-right mt-2'>
        <Button
          type='submit'
          className='rounded-pill'
          variant='primary'
          onClick={() => {
            login();
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

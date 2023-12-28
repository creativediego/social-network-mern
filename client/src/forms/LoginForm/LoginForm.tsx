import React from 'react';
import { Button } from 'react-bootstrap';
import { AlertBox, Loader, PopupModal } from '../../components';
import FormField from '../FormInput/FormField';
import { profileFieldsStore } from '../shared/profileFieldsStore';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useAlert } from '../../hooks/useAlert';
import useToggleBoolean from '../../hooks/useToggleBoolean';

/**
 * User login form component: Displays loading button when login in being processed. Displays error message if login fails. Uses useAuthUser hook to manage login state. Uses useAlert hook to display error message. Uses FormInput component to display form inputs. Uses profileFields to display form input fields.
 */
const LoginForm = (): JSX.Element => {
  const { error } = useAlert();
  const { login, loading, handleSetLoginUser, loginUser, isLoggedIn } =
    useAuthUser();
  const [showLoginModal, setShowLoginModal] = useToggleBoolean(false);

  return (
    <div className='mt-4'>
      <Button
        className='rounded-pill w-100'
        variant='light'
        onClick={setShowLoginModal}
      >
        Login with email or username
      </Button>
      {!isLoggedIn && (
        <PopupModal
          title='Log in'
          show={showLoginModal}
          closeModal={setShowLoginModal}
          size='lg'
        >
          <form>
            <FormField
              {...profileFieldsStore['email']}
              dataTestId='login-user'
              placeholder='email'
              value={loginUser.email}
              onChange={(e: React.FormEvent<HTMLInputElement>) =>
                handleSetLoginUser(e)
              }
            />
            <FormField
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
        </PopupModal>
      )}
    </div>
  );
};

export default LoginForm;

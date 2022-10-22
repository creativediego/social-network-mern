import React, { useEffect } from 'react';
import { PopupModal } from '../../components';
import UpdateProfileForm from '../../forms/UpdateProfileForm/UpdateProfileForm';
import { Button } from 'react-bootstrap';
// @ts-ignore
import { SignupForm } from '../../forms';
// @ts-ignore
import { LoginForm } from '../../forms';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearUser, loginWithGoogleThunk } from '../../redux/userSlice';
import useToggleBoolean from '../../hooks/useToggleBoolean';

const LoginView = () => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const profileComplete = useAppSelector((state) => state.user.profileComplete);
  const dispatch = useAppDispatch();
  const [showSignupModal, setShowSignupModal] = useToggleBoolean(false);
  const [showLoginModal, setShowLoginModal] = useToggleBoolean(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] =
    useToggleBoolean(true);

  // Clears user session if user closes the complete signup modal.
  useEffect(() => {
    if (!showUpdateProfileModal) {
      dispatch(clearUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showUpdateProfileModal]);

  return (
    <div>
      <h1 className='fs-1'>Happening Now</h1>
      <div className='col-md-7'>
        <div className='mt-3'>
          <h5>Join Tuiter Today</h5>
          <Button
            className='rounded-pill w-100'
            variant='primary'
            onClick={setShowSignupModal}
          >
            Sign up with email
          </Button>

          <PopupModal
            title='Create an Account'
            show={showSignupModal}
            setShow={setShowSignupModal}
            size='lg'
          >
            <SignupForm />
          </PopupModal>

          {isLoggedIn && !profileComplete && (
            <PopupModal
              title='Complete Signup'
              show={showUpdateProfileModal}
              setShow={setShowUpdateProfileModal}
              size='lg'
            >
              <UpdateProfileForm />
            </PopupModal>
          )}
        </div>
        <hr />

        <div className='mt-4'>
          <h2 className='fs-6'>Already have an account?</h2>
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
              setShow={setShowLoginModal}
              size='lg'
            >
              <LoginForm />
            </PopupModal>
          )}
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
    </div>
  );
};

export default LoginView;

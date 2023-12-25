import React from 'react';
import { ReactHookFormInput, UpdateProfileForm } from '../';
import { ActionButton, PopupModal } from '../../components';
import { Button } from 'react-bootstrap';
import useToggleBoolean from '../../hooks/useToggleBoolean';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useSignUpForm } from './useSignupForm';

const SignupForm = (): JSX.Element => {
  const [showSignupModal, setShowSignupModal] = useToggleBoolean(false);
  const [showUpdateProfileModal, setShowUpdateProfileModal] =
    useToggleBoolean(true);
  const { user } = useAuthUser();

  const { completeSignup, loading, submitForm, register, errors } =
    useSignUpForm();

  return (
    <>
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
        <form onSubmit={submitForm} className='form-container'>
          <ReactHookFormInput
            label='Email'
            id='email'
            type='email'
            register={register('email')}
            error={errors}
          />
          <ReactHookFormInput
            label='Password'
            id='password'
            type='password'
            register={register('password')}
            error={errors}
          />
          <ReactHookFormInput
            label='Confirm Password'
            id='confirmPassword'
            type='password'
            register={register('confirmPassword')}
            error={errors}
          />
          <ActionButton position={'right'} loading={loading} />
        </form>
      </PopupModal>

      {completeSignup && (
        <PopupModal
          title='Complete Signup'
          show={showUpdateProfileModal}
          setShow={setShowUpdateProfileModal}
          size='lg'
        >
          <UpdateProfileForm user={user} />
        </PopupModal>
      )}
    </>
  );
};

export default SignupForm;

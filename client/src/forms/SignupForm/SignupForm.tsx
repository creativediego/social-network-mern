import React, { memo } from 'react';
import { ReactHookFormInput, UpdateProfileForm } from '../';
import { ActionButton, PopupModal } from '../../components';
import { Button } from 'react-bootstrap';
import useToggle from '../../hooks/useToggle';
import { useSignUpForm } from './useSignupForm';
import { useAuthUser } from '../../hooks/useAuthUser';

/**
 * `SignupForm` is a component that displays the signup form.
 *
 * It uses the `useToggleBoolean` hook to manage the visibility of the signup and update profile modals.
 * It also uses the `useAuthUser` hook to get the current authenticated user.
 * It uses the `useSignUpForm` hook to manage the signup form state and actions.
 *
 * @component
 * @example
 * Example usage of SignupForm component
 * <SignupForm />
 *
 * @returns {JSX.Element} A JSX element representing the signup form.
 */
const SignupForm = (): JSX.Element => {
  const { user } = useAuthUser();
  const [showSignupModal, setShowSignupModal] = useToggle(false);
  const {
    isLoggedIn,
    isVerified,
    completedSignup,
    loading,
    registerWithEmail,
    registerWithGoogle,
    register,
    errors,
  } = useSignUpForm();

  return (
    <>
      <Button
        className='rounded-pill w-100 mb-3'
        variant='primary'
        onClick={setShowSignupModal}
      >
        Sign up with email
      </Button>

      {!completedSignup && (
        <PopupModal
          title='Create an Account'
          show={showSignupModal}
          closeModal={setShowSignupModal}
          size='lg'
        >
          <form onSubmit={registerWithEmail} className='form-container'>
            <ReactHookFormInput
              label='Name'
              id='name'
              type='name'
              register={register('name')}
              error={errors}
              hide={user.registeredWithProvider}
            />

            <ReactHookFormInput
              label='Username'
              id='username'
              type='username'
              register={register('username')}
              error={errors}
            />

            <ReactHookFormInput
              label='Email'
              id='email'
              type='email'
              register={register('email')}
              error={errors}
              hide={user.registeredWithProvider}
            />

            <ReactHookFormInput
              label='Password'
              id='password'
              type='password'
              register={register('password')}
              error={errors}
              hide={user.registeredWithProvider}
            />
            <ReactHookFormInput
              label='Confirm Password'
              id='confirmPassword'
              type='password'
              register={register('confirmPassword')}
              error={errors}
              hide={user.registeredWithProvider}
            />
            <ActionButton position={'right'} loading={loading} />
          </form>
        </PopupModal>
      )}
      {isLoggedIn && isVerified && !completedSignup && (
        <PopupModal title='Complete Your Profile' show={true} size='lg'>
          <UpdateProfileForm />
        </PopupModal>
      )}
    </>
  );
};

export default memo(SignupForm);

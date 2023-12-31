import React from 'react';
import { ReactHookFormInput, UpdateProfileForm } from '../';
import { ActionButton, PopupModal } from '../../components';
import { Button } from 'react-bootstrap';
import useToggleBoolean from '../../hooks/useToggleBoolean';
import { useAuthUser } from '../../hooks/useAuthUser';
import { useSignUpForm } from './useSignupForm';

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
        closeModal={setShowSignupModal}
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
          closeModal={setShowUpdateProfileModal}
          size='lg'
        >
          <UpdateProfileForm user={user} />
        </PopupModal>
      )}
    </>
  );
};

export default SignupForm;

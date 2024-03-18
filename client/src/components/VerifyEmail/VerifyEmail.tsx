import React from 'react';
import { useSignUpForm } from '../../forms/SignupForm/useSignupForm';
import { ActionButton } from '..';
import LogoutButton from '../Profile/LogoutButton/LogoutButton';

const VerifyEmail = (): JSX.Element => {
  const { sendVerificationEmail, verificationResent, loading } =
    useSignUpForm();
  return (
    <div className='container mt-5'>
      <h1>Almost there!</h1>
      <div className='alert alert-primary' role='alert'>
        <div className='row align-items-center'>
          <div className='col-md-2'>
            <i className='fas fa-envelope-open-text fa-4x'></i>
          </div>
          <div className='col-md-5'>
            <p className='mb-0'>
              Please verify your email address. We've sent a link to your email.
            </p>
          </div>

          <div className='col-md-5 text-right d-flex'>
            <ActionButton
              label={!verificationResent ? 'Resend' : 'Sent!'}
              color='secondary'
              loading={loading}
              submitAction={sendVerificationEmail}
            />
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;

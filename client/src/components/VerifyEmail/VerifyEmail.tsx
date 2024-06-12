import { useSignUpForm } from '../../forms/SignupForm/useSignupForm';
import { ActionButton } from '..';
import LogoutButton from '../Profile/LogoutButton/LogoutButton';

/**
 * `VerifyEmail` is a component that prompts the user to verify their email address.
 * It uses the `useSignUpForm` hook to get the `sendVerificationEmail` function, the `verificationResent` state, and the `loading` state.
 * The component renders a message asking the user to verify their email address and an `ActionButton` that, when clicked, calls the `sendVerificationEmail` function.
 * If `verificationResent` is `true`, it renders a message saying that the verification email has been resent.
 * If `loading` is `true`, it disables the `ActionButton`.
 *
 * @returns {JSX.Element} The `VerifyEmail` component, which includes a message asking the user to verify their email address and an `ActionButton` to resend the verification email.
 *
 * @example
 * <VerifyEmail />
 *
 * @see {@link useSignUpForm} for the hook that provides the `sendVerificationEmail` function, the `verificationResent` state, and the `loading` state.
 * @see {@link ActionButton} for the component that renders the button to resend the verification email.
 */
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

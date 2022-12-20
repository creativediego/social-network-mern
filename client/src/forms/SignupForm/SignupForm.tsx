import React from 'react';
import { Button } from 'react-bootstrap';
import useSignupForm from './useSignupForm';
import FormInput from '../FormInput/FormInput';
import { AlertBox, Loader } from '../../components';
import { useAppSelector } from '../../redux/hooks';
import { useAlert } from '../../hooks/useAlert';

/**
 * Displays the registration/signup form with submit button. Uses the custom hook useSignupForm to manage state and process submission.
 */
const SignupForm = (): JSX.Element => {
  const { fields, setField, submitForm } = useSignupForm();
  const loading = useAppSelector((state) => state.user.loading);
  const { error } = useAlert();
  return (
    <div>
      {Object.values(fields).map((field) => (
        <FormInput
          key={field.id}
          {...field}
          value={field.value}
          onChange={setField}
        />
      ))}
      <span className='fa-pull-right mt-2'>
        <Button
          type='submit'
          className='rounded-pill'
          variant='primary'
          onClick={() => {
            submitForm();
          }}
        >
          {loading ? <Loader loading={loading} /> : <>Create</>}
        </Button>
      </span>
      <AlertBox message={error.message} />
    </div>
  );
};

export default SignupForm;

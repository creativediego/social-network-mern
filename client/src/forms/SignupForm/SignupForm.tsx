import React from 'react';
import useSignupForm from './useSignupForm';
import FormField from '../FormInput/FormField';
import { useAlert } from '../../hooks/useAlert';
import { FormContainer } from '../';

/**
 * Displays the registration/signup form with submit button. Uses the custom hook useSignupForm to manage state and process submission.
 */
const SignupForm = (): JSX.Element => {
  const { fields, setField, submitForm, loading } = useSignupForm();
  const { error } = useAlert();
  return (
    <>
      <FormContainer
        onSubmit={submitForm}
        loading={loading}
        error={error.message}
      >
        {Object.values(fields).map((field) => (
          <FormField
            key={field.id}
            {...field}
            value={field.value}
            onChange={setField}
          />
        ))}
      </FormContainer>
    </>
  );
};

export default SignupForm;

import { React, useState } from 'react';
import './FormInput.css';

/**
 * Form input for a form.
 */
const FormInput = (props) => {
  const [focused, setFocused] = useState(false);
  const handleFocus = (e) => {
    if (e.target.value) setFocused(true);
  };
  const { errorMessage, onChange, label, dataTestId, ...inputProps } = props;
  return (
    <span>
      <label htmlFor={label} className='form-label'></label>
      <input
        className='form-control'
        data-testid={dataTestId}
        onChange={onChange}
        {...inputProps}
        onBlur={handleFocus}
        onFocus={(e) =>
          inputProps.name === 'confirmPassword' &&
          e.target.value !== '' &&
          setFocused(true)
        }
        focused={focused.toString()}
      />
      <span className='text-danger validation-error'>{errorMessage}</span>
    </span>
  );
};

export default FormInput;

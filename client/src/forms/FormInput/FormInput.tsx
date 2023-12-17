import React, { useState, memo } from 'react';
import './FormInput.scss';

interface FormInputProps {
  id: string;
  type: string;
  name: string;
  value: string;
  placeholder: string;
  label: string;
  pattern?: string;
  required: boolean;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  errorMessage: string;
  dataTestId?: number | string;
  cssClass?: string;
}
/**
 * Form input for a form.
 */
const FormInput = (props: FormInputProps) => {
  const { errorMessage, onChange, label, dataTestId, cssClass, ...inputProps } =
    props;
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (
      e.target.pattern &&
      (e.target.validity.patternMismatch || e.target.validity.typeMismatch)
    ) {
      setError(errorMessage);
    } else {
      clearError();
    }
  };

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    clearError();
    onChange(e);
  };

  return (
    <span>
      <label htmlFor={label} className='form-label'>
        {label}
      </label>
      <input
        className={`form-control mb-2 ${cssClass && cssClass}`}
        data-testid={dataTestId}
        onChange={handleOnChange}
        {...inputProps}
        onBlur={handleBlur}
        autoFocus
      />
      {error && <span className='text-danger validation-error'>{error}</span>}
    </span>
  );
};

export default memo(FormInput);

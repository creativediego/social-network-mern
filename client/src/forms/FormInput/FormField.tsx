import React, { useState, memo } from 'react';
import './FormField.scss';

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
  readOnly?: boolean;
}
/**
 * Form input for a form.
 */
const FormField = (props: FormInputProps) => {
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
    <span style={{ display: `${inputProps.readOnly ? 'none' : 'inherit'}` }}>
      <label htmlFor={label} className='form-label'>
        {label}
      </label>
      <input
        className={`form-control mb-2 ${cssClass && cssClass} ${
          inputProps.readOnly && 'text-muted'
        }`}
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

export default memo(FormField);

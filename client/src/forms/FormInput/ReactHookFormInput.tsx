import React, { memo } from 'react';
import { Placeholder } from 'react-bootstrap';
import { UseFormRegisterReturn, FieldErrors } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  register: UseFormRegisterReturn; // Correct type from react-hook-form
  errors: Partial<FieldErrors>; // Correct type from react-hook-form
  disabled?: boolean;
  hide?: boolean;
  placeholder?: string;
}

const ReactHookFormInput = ({
  label,
  id,
  type,
  register,
  errors,
  disabled,
  hide,
  placeholder,
}: InputFieldProps) => (
  <>
    {!hide ? (
      <div>
        <label className='form-label' htmlFor={id}>
          {label}
        </label>
        <input
          className='form-control mb-2'
          type={type}
          id={id}
          {...register}
          disabled={disabled ? disabled : false}
          placeholder={placeholder}
        />
        {errors[id] && (
          <span className='text-danger validation-error'>{`${errors[id]?.message}`}</span>
        )}
      </div>
    ) : null}
  </>
);

export default memo(ReactHookFormInput);

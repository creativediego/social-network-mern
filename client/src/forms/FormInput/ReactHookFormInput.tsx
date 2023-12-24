import React from 'react';
import { UseFormRegisterReturn, FieldErrors } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  id: string;
  type: string;
  register: UseFormRegisterReturn; // Correct type from react-hook-form
  error: Partial<FieldErrors>; // Correct type from react-hook-form
  disabled?: boolean;
}

const ReactHookFormInput = ({
  label,
  id,
  type,
  register,
  error,
  disabled,
}: InputFieldProps) => (
  <>
    {!disabled ? (
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
        />
        {error[id] && (
          <span className='text-danger validation-error'>{`${error[id]?.message}`}</span>
        )}
      </div>
    ) : null}
  </>
);

export default ReactHookFormInput;

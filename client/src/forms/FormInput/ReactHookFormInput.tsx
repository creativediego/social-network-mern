import { memo } from 'react';
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

/**
 * `ReactHookFormInput` is a component that renders an input field for a form.
 * It takes in `label`, `id`, `type`, `register`, `errors`, `disabled`, `hide`, and `placeholder` as properties.
 * The `label`, `id`, `type`, `register`, `disabled`, `hide`, and `placeholder` props are used as attributes for the input field.
 * The `register` function is used to register the input field with React Hook Form.
 * The `errors` object is used to display validation errors for the input field.
 *
 * @param {InputFieldProps} props - The properties passed to the component.
 * @param {string} props.label - The label to display above the input field.
 * @param {string} props.id - The id attribute for the input field.
 * @param {string} props.type - The type attribute for the input field.
 * @param {UseFormRegisterReturn} props.register - The function to register the input field with React Hook Form.
 * @param {Partial<FieldErrors>} props.errors - The object to display validation errors for the input field.
 * @param {boolean} [props.disabled] - The disabled attribute for the input field.
 * @param {boolean} [props.hide] - The hide attribute for the input field.
 * @param {string} [props.placeholder] - The placeholder attribute for the input field.
 *
 * @returns {JSX.Element} The `ReactHookFormInput` component, which includes an input field for a form.
 *
 * @example
 * <ReactHookFormInput label={label} id={id} type={type} register={register} errors={errors} disabled={disabled} hide={hide} placeholder={placeholder} />
 *
 * @see {@link UseFormRegisterReturn} for the function to register the input field with React Hook Form.
 * @see {@link FieldErrors} for the object to display validation errors for the input field.
 */
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

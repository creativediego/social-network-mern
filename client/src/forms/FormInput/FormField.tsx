import { useState, memo, FocusEvent, FormEvent } from 'react';
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
 * `FormField` is a component that renders an input field for a form.
 * It takes in `id`, `type`, `name`, `value`, `placeholder`, `label`, `pattern`, `required`, `onChange`, `errorMessage`, `dataTestId`, `cssClass`, and `readOnly` as properties.
 * The `id`, `type`, `name`, `value`, `placeholder`, `pattern`, `required`, and `readOnly` props are used as attributes for the input field.
 * The `onChange` function is called when the input value changes.
 * The `label` is displayed above the input field.
 * The `errorMessage` is displayed when the input value does not match the pattern or the input type.
 * The `dataTestId` is used for testing.
 * The `cssClass` is used to style the input field.
 *
 * @param {FormInputProps} props - The properties passed to the component.
 * @param {string} props.id - The id attribute for the input field.
 * @param {string} props.type - The type attribute for the input field.
 * @param {string} props.name - The name attribute for the input field.
 * @param {string} props.value - The value attribute for the input field.
 * @param {string} props.placeholder - The placeholder attribute for the input field.
 * @param {string} props.label - The label to display above the input field.
 * @param {string} [props.pattern] - The pattern attribute for the input field.
 * @param {boolean} props.required - The required attribute for the input field.
 * @param {(e: React.FormEvent<HTMLInputElement>) => void} props.onChange - The function to call when the input value changes.
 * @param {string} props.errorMessage - The error message to display when the input value does not match the pattern or the input type.
 * @param {number | string} [props.dataTestId] - The data test ID for testing.
 * @param {string} [props.cssClass] - The CSS class to style the input field.
 * @param {boolean} [props.readOnly] - The readOnly attribute for the input field.
 *
 * @returns {JSX.Element} The `FormField` component, which includes an input field for a form.
 *
 * @example
 * <FormField id={id} type={type} name={name} value={value} placeholder={placeholder} label={label} pattern={pattern} required={required} onChange={onChange} errorMessage={errorMessage} dataTestId={dataTestId} cssClass={cssClass} readOnly={readOnly} />
 */
const FormField = (props: FormInputProps) => {
  const { errorMessage, onChange, label, dataTestId, cssClass, ...inputProps } =
    props;
  const [error, setError] = useState('');

  const clearError = () => {
    setError('');
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    if (
      e.target.pattern &&
      (e.target.validity.patternMismatch || e.target.validity.typeMismatch)
    ) {
      setError(errorMessage);
    } else {
      clearError();
    }
  };

  const handleOnChange = (e: FormEvent<HTMLInputElement>) => {
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

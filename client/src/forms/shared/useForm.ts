import { useState, FormEvent } from 'react';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { useAlert } from '../../hooks/useAlert';

interface useFormProps {
  initialValues: FormFieldI;
  onSubmit: (values: FormFieldI) => Promise<void>;
}

/**
 * `useForm` is a custom hook that manages form state.
 * It takes in `initialValues` and `onSubmit` as arguments.
 * The `initialValues` object is used to set the initial values of the form fields.
 * The `onSubmit` function is called when the form is submitted.
 * The hook uses the `useState` hook from React to manage the form fields and the `useAlert` hook to manage the error state.
 * The hook returns `fields`, `setField`, and `addField` functions.
 * The `fields` object contains the current values of the form fields.
 * The `setField` function is used to update the value of a specific form field.
 * The `addField` function is used to add a new field to the form.
 *
 * @param {useFormProps} props - The arguments passed to the hook.
 * @param {FormFieldI} props.initialValues - The initial values of the form fields.
 * @param {(values: FormFieldI) => Promise<void>} props.onSubmit - The function to call when the form is submitted.
 *
 * @returns {Object} The `fields`, `setField`, and `addField` functions.
 *
 * @example
 * const { fields, setField, addField } = useForm({ initialValues, onSubmit });
 *
 * @see {@link useState} for the hook that manages the form fields.
 * @see {@link useAlert} for the hook that manages the error state.
 */
const useForm = ({ initialValues, onSubmit }: useFormProps) => {
  const [fields, setFields] = useState<FormFieldI>({ ...initialValues });
  const { setError } = useAlert();

  const addField = (newField: FormFieldI) => {
    setFields((prevState) => ({
      ...prevState,
      ...newField,
    }));
  };

  const setField = (e: FormEvent<HTMLInputElement>) => {
    const element: HTMLInputElement = e.currentTarget;
    setFields((prevState) => ({
      ...prevState,
      [element.name]: {
        ...prevState[element.name],
        value: element.value,
      },
    }));
  };

  const isFormValid = () => {
    for (const field of Object.values(fields)) {
      const regexPattern = new RegExp(field.pattern);
      if (!regexPattern.test(field.value)) {
        setError(field.errorMessage);
        return false;
      }
    }
    return true;
  };

  const submitForm = () => {
    if (!isFormValid()) {
      return;
    }
    onSubmit(fields);
  };

  return { fields, setField, addField, submitForm };
};

export default useForm;

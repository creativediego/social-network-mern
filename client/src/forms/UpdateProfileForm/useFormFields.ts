import { useCallback, useEffect, useState } from 'react';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { IUser } from '../../interfaces/IUser';

/**
 * `useFormFields` is a custom hook that manages the state of form fields.
 * It takes in `initialFields` and `authUser` as arguments.
 * The `initialFields` object is used to set the initial values of the form fields.
 * The `authUser` object is used to update the form fields when it changes.
 * The hook uses the `useState` and `useEffect` hooks from React to manage the form fields.
 * The hook returns `inputFields` and `setInputField` function.
 * The `inputFields` object contains the current values of the form fields.
 * The `setInputField` function is used to update the value of a specific form field.
 *
 * @param {FormFieldI} initialFields - The initial values of the form fields.
 * @param {IUser} authUser - The user object to update the form fields from.
 *
 * @returns {Object} The `inputFields` and `setInputField` function.
 *
 * @example
 * const { inputFields, setInputField } = useFormFields(initialFields, authUser);
 *
 * @see {@link useState} for the hook that manages the form fields.
 * @see {@link useEffect} for the hook that updates the form fields when `authUser` changes.
 * @see {@link useCallback} for the hook that memoizes the `setInputField` function.
 */
const useFormFields = (initialFields: FormFieldI, authUser: IUser) => {
  const [inputFields, setInputFields] = useState<FormFieldI>(initialFields);

  const setInputField = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInputFields((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], value },
    }));
  }, []);

  useEffect(() => {
    const updatedInputFields = { ...inputFields };
    for (const [key, value] of Object.entries(authUser)) {
      if (key in initialFields) {
        updatedInputFields[key] = { ...initialFields[key], value };
      }
    }
    setInputFields(updatedInputFields);
  }, [authUser, initialFields, inputFields]);

  return { inputFields, setInputField };
};

export default useFormFields;

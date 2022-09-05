import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { registerThunk } from '../../redux/userSlice';
import { InputFieldI } from '../../interfaces/InputFieldI';
import { IError } from '../../interfaces/IError';

const useSignupForm = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<IError>({ message: '' });
  const [fields, setFields] = useState<InputFieldI>({
    email: {
      id: '1',
      name: 'email',
      type: 'text',
      placeholder: 'email',
      errorMessage: 'It should be a valid email address!',
      label: 'email',
      required: true,
      value: '',
      pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
    },
    password: {
      id: '2',
      name: 'password',
      type: 'password',
      placeholder: 'password',
      errorMessage:
        'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
      label: 'password',
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
      value: 'Pass123!',
    },
  });

  useEffect(() => {
    setFields((prevState) => ({
      ...prevState,
      confirmPassword: {
        id: '3',
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'confirm password',
        errorMessage: "Passwords don't match!",
        label: 'confirm password',
        required: true,
        pattern: fields.password.value,
        value: 'Pass123!',
      },
    }));
  }, [fields.password.value]);

  const setField = (e: React.FormEvent<HTMLInputElement>) => {
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
      if (!regexPattern.test(field.value)) return false;
    }
    return true;
  };

  const submitForm = () => {
    if (!isFormValid()) {
      return;
    }
    dispatch(
      registerThunk({
        email: fields.email.value,
        password: fields.password.value,
      })
    );
  };
  return { fields, setField, submitForm };
};

export default useSignupForm;

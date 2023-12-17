import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { registerThunk } from '../../redux/userSlice';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { profileFieldsStore } from '../shared/profileFieldsStore';

const useSignupForm = () => {
  const dispatch = useAppDispatch();
  const [fields, setFields] = useState<FormFieldI>({
    email: profileFieldsStore['email'],
    password: profileFieldsStore['password'],
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
        value: '',
      },
    }));
  }, [fields.password.value]);

  const setField = (e: React.FormEvent<HTMLInputElement>) => {
    const field: HTMLInputElement = e.currentTarget;
    setFields((prevState) => ({
      ...prevState,
      [field.name]: {
        ...prevState[field.name],
        value: field.value,
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

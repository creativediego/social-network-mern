import React, { useState } from 'react';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { useAlert } from '../../hooks/useAlert';

interface useFormProps {
  initialValues: FormFieldI;
  onSubmit: (values: FormFieldI) => Promise<void>;
}

const useForm = ({ initialValues, onSubmit }: useFormProps) => {
  const [fields, setFields] = useState<FormFieldI>({ ...initialValues });
  const { setError } = useAlert();

  const addField = (newField: FormFieldI) => {
    setFields((prevState) => ({
      ...prevState,
      ...newField,
    }));
  };

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

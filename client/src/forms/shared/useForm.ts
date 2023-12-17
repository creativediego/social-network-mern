import React, { useState } from 'react';
import { FormFieldI } from '../../interfaces/FormFieldI';

interface useFormProps {
  inputFields: FormFieldI;
  submitAction: () => void;
}

const useForm = ({ inputFields, submitAction }: useFormProps) => {
  const [fields, setFields] = useState<FormFieldI>({ ...inputFields });

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
      if (!regexPattern.test(field.value)) return false;
    }
    return true;
  };

  const submitForm = () => {
    if (!isFormValid()) {
      return;
    }
    submitAction();
  };

  return { fields, setField, addField, submitForm };
};

export default useForm;

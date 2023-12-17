import { useCallback, useEffect, useState } from 'react';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { IUser } from '../../interfaces/IUser';

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

import React from 'react';
import { ActionButton, AlertBox } from '../../components';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { FormField } from '../';
import useForm from '../shared/useForm';
import { useAlert } from '../../hooks/useAlert';

interface FormContainerProps {
  onSubmit: (values: FormFieldI) => Promise<void>;
  submitCallBack?: () => void;
  loading: boolean;
  initialValues: FormFieldI;
  children?: React.ReactNode;
  dependentFields?: { [key: string]: string };
}

const Form: React.FC<FormContainerProps> = ({
  children,
  onSubmit,
  submitCallBack,
  initialValues,
  loading,
}) => {
  const { fields, setField, submitForm } = useForm({
    initialValues,
    onSubmit,
  });
  const { error } = useAlert();
  return (
    <div className='form-container'>
      {children // If not passed children, render form fields
        ? children
        : Object.values(fields).map((input) => (
            <FormField key={input.id} onChange={setField} {...input} />
          ))}

      <ActionButton
        submitAction={() => {
          submitForm();
          if (submitCallBack) {
            submitCallBack();
          }
        }}
        position={'right'}
        loading={loading}
      />
      <AlertBox message={error.message} />
    </div>
  );
};

export default Form;

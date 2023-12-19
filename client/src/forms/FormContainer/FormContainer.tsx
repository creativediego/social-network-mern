import React from 'react';
import { ActionButton, AlertBox } from '../../components';

interface FormContainerProps {
  children: React.ReactNode;
  onSubmit: () => void;
  submitCallBack?: () => void;
  loading: boolean;
  error: string;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  onSubmit,
  loading,
  submitCallBack,
  error,
}) => {
  return (
    <div className='form-container'>
      {children}
      <ActionButton
        submitAction={() => {
          onSubmit();
          if (submitCallBack) {
            submitCallBack();
          }
        }}
        position={'right'}
        loading={loading}
      />
      <AlertBox message={error} />
    </div>
  );
};

export default FormContainer;

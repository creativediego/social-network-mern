import React from 'react';
import { Controller, Control } from 'react-hook-form';

interface InputImageFieldProps {
  id: string;
  control: Control<any>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const ReactHookImageInput = ({
  id,
  control,
  className,
  handleFileChange,
}: InputImageFieldProps) => (
  <>
    <Controller
      name={id}
      control={control}
      defaultValue={undefined}
      render={({ field }) => (
        <input
          type='file'
          className={className}
          id={id}
          accept='image/*'
          onChange={(e) => {
            handleFileChange(e);
            field.onChange(e.target.files); // Directly pass FileList
          }}
          ref={field.ref}
        />
      )}
    />
  </>
);

export default ReactHookImageInput;

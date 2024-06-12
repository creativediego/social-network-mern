import { ChangeEvent } from 'react';
import { Controller, Control } from 'react-hook-form';

interface InputImageFieldProps {
  id: string;
  control: Control<any>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

/**
 * `ReactHookImageInput` is a component that renders an image input field for a form.
 * It takes in `id`, `control`, `handleFileChange`, and `className` as properties.
 * The `id` and `control` props are used as attributes for the `Controller` component from React Hook Form.
 * The `handleFileChange` function is called when the input value changes.
 * The `className` is used to style the input field.
 *
 * @param {InputImageFieldProps} props - The properties passed to the component.
 * @param {string} props.id - The id attribute for the input field.
 * @param {Control<any>} props.control - The control attribute for the `Controller` component from React Hook Form.
 * @param {(e: ChangeEvent<HTMLInputElement>) => void} props.handleFileChange - The function to call when the input value changes.
 * @param {string} [props.className] - The CSS class to style the input field.
 *
 * @returns {JSX.Element} The `ReactHookImageInput` component, which includes an image input field for a form.
 *
 * @example
 * <ReactHookImageInput id={id} control={control} handleFileChange={handleFileChange} className={className} />
 *
 * @see {@link Controller} for the component from React Hook Form that provides the control attribute.
 */

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

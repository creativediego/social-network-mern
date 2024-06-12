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

/**
 * `Form` is a component that renders a form with dynamic fields.
 * It uses the `useForm` hook to get the `fields`, `setField`, and `submitForm` functions, and the `useAlert` hook to get the `error` state.
 * The `Form` component takes in `children`, `onSubmit`, `submitCallBack`, `initialValues`, and `loading` as props.
 * The `children` prop is used to render the form fields, the `onSubmit` function is called when the form is submitted, the `submitCallBack` function is called after the form is submitted, the `initialValues` object is used to set the initial values of the form fields, and the `loading` boolean is used to disable the form fields while the form is being submitted.
 *
 * @param {FormContainerProps} props - The properties passed to the component.
 * @param {React.ReactNode} props.children - The form fields.
 * @param {(values: FormFieldI) => Promise<void>} props.onSubmit - The function to call when the form is submitted.
 * @param {() => void} props.submitCallBack - The function to call after the form is submitted.
 * @param {boolean} props.loading - A boolean indicating whether the form is being submitted.
 * @param {FormFieldI} props.initialValues - The initial values of the form fields.
 *
 * @returns {JSX.Element} The `Form` component, which includes a form with dynamic fields.
 *
 * @example
 * <Form children={children} onSubmit={onSubmit} submitCallBack={submitCallBack} initialValues={initialValues} loading={loading} />
 *
 * @see {@link useForm} for the hook that provides the `fields`, `setField`, and `submitForm` functions.
 * @see {@link useAlert} for the hook that provides the `error` state.
 */
const Form = ({
  children,
  onSubmit,
  submitCallBack,
  initialValues,
  loading,
}: FormContainerProps) => {
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

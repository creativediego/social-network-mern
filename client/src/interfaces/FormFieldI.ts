// Based on HTML input element attributes
export interface FormFieldI {
  [key: string]: {
    id: string;
    name: string;
    type: string;
    value: string;
    placeholder: string;
    errorMessage: string;
    label: string;
    required: boolean;
    pattern: string;
    readOnly?: boolean;
  };
}

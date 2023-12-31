import * as React from 'react';
import { Alert } from 'react-bootstrap';
import './AlertBox.scss';
import { useAlert } from '../../hooks/useAlert';

/**
 * `AlertBoxProps` is an interface that defines the properties for the `AlertBox` component.
 *
 * @interface
 * @property {string} message - The message to display in the alert box. This is a required property.
 * @property {string} heading - The heading of the alert box. This is an optional property.
 * @property {'success' | 'primary' | 'warning'} variant - The bootstrap variant class of the alert box. This is an optional property.
 */
interface AlertBoxProps {
  message: string;
  heading?: string;
  variant?: 'success' | 'primary' | 'warning';
}

/**
 * `AlertBox` is a component that displays an alert message with an option to dismiss the message.
 *
 * It uses the `useState` and `useEffect` hooks to manage the visibility of the alert.
 * It also uses the `useAlert` hook to clear all alerts.
 *
 * @component
 * @example
 * Example usage of AlertBox component
 * <AlertBox heading="Success" message="Operation completed successfully." variant="success" />
 *
 * @param {AlertBoxProps} props - The properties that define the alert box.
 * @param {string} props.heading - The heading of the alert box.
 * @param {string} props.message - The message to display in the alert box.
 * @param {'success' | 'primary' | 'warning'} props.variant - The variant of the alert box.
 *
 * @returns {JSX.Element | null} A JSX element representing the alert box if the message exists, or null otherwise.
 */
const AlertBox = ({
  heading,
  message,
  variant,
}: AlertBoxProps): JSX.Element | null => {
  const [show, setShow] = React.useState(true);
  const { clearAllAlerts } = useAlert();

  React.useEffect(() => {
    if (!message) {
      setShow(false);
    } else {
      setShow(true);
    }
  }, [message]);

  if (show) {
    return (
      <Alert
        variant={variant ? variant : 'warning'}
        className='alert-fixed'
        onClose={() => {
          setShow(false);
          clearAllAlerts();
        }}
        dismissible
      >
        <Alert.Heading>{heading && heading}</Alert.Heading>
        <p>{message && message}</p>
      </Alert>
    );
  }
  return null;
};

export default AlertBox;

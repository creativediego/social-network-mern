import * as React from 'react';
import { Alert } from 'react-bootstrap';
import './AlertBox.scss';
import { useAlert } from '../../hooks/useAlert';

interface AlertBoxProps {
  heading?: string;
  message: string;
  variant?: 'success' | 'primary' | 'warning';
}
/**
 * Displays an alert message with option to dismiss message.
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

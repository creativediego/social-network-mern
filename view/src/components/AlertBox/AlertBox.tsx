import * as React from 'react';
import { Alert } from 'react-bootstrap';
import './AlertBox.scss';
import { useAppDispatch } from '../../redux/hooks';
import { clearAllErrors } from '../../redux/errorSlice';

interface AlertBoxProps {
  heading?: string;
  message: string;
}
/**
 * Displays an alert message with option to dismiss message.
 */
const AlertBox = ({ heading, message }: AlertBoxProps): JSX.Element | null => {
  const [show, setShow] = React.useState(true);
  const dispatch = useAppDispatch();

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
        variant='warning'
        className='alert-fixed'
        onClose={() => {
          setShow(false);
          dispatch(clearAllErrors());
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

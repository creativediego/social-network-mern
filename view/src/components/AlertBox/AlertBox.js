import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import './AlertBox.css';
import { useDispatch } from 'react-redux';
import { clearGlobalError } from '../../redux/errorSlice';
/**
 * Displays an alert message with option to dismiss message.
 */
const AlertBox = ({ heading, message }) => {
  const [show, setShow] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
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
          dispatch(clearGlobalError());
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

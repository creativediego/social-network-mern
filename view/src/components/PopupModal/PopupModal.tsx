import React, { memo } from 'react';
import { Modal } from 'react-bootstrap';
import { selectGlobalErrorMessage } from '../../redux/errorSlice';
import { useAppSelector } from '../../redux/hooks';
import AlertBox from '../AlertBox/AlertBox';

// interface PopupModalContent {
//   title: string;
//   body: JSX.Element;
//   submitLabel: string;
// }
interface PopupModalProps {
  title: string | JSX.Element;
  show: boolean;
  size: 'sm' | 'lg';
  setShow: () => void;
  locked?: boolean;
  children?: React.ReactNode;
}
/**
 * A dismissible popup modal with  a title, content, and submit action customizable via props.
 */
const PopupModal: React.FC<PopupModalProps> = ({
  title,
  show,
  size,
  setShow,
  locked,
  children,
}) => {
  const handleShow = (): void => {
    setShow();
  };
  const errorMessage = useAppSelector(selectGlobalErrorMessage);
  return (
    <div>
      <Modal
        size={size}
        show={show}
        onHide={handleShow}
        backdrop={locked ? 'static' : true}
      >
        <Modal.Header closeButton={locked ? false : true}>
          <h5>{title}</h5>
        </Modal.Header>
        <Modal.Body>
          {children && children}
          <AlertBox message={errorMessage} />
        </Modal.Body>
        {/* <Modal.Footer>
          <Button
            type='submit'
            className='rounded-pill'
            variant='primary'
            onClick={() => {
              handleSubmit();
            }}
          >
            {content.submitLabel}
           
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default memo(PopupModal);

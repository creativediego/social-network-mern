import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useAppSelector } from '../../redux/hooks';
import AlertBox from '../AlertBox/AlertBox';

// interface PopupModalContent {
//   title: string;
//   body: JSX.Element;
//   submitLabel: string;
// }
interface PopupModalProps {
  title: string;
  show: boolean;
  size: 'sm' | 'lg';
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
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
    setShow(!show);
  };
  const errorMessage = useAppSelector((state) => state.error.message);
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

export default PopupModal;

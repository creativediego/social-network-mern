import * as React from 'react';
import { Button, Modal } from 'react-bootstrap';

interface PopupModalContent {
    size: 'sm' | 'lg' | 'xl',
    title: string,
    body: JSX.Element,
    submitLabel: string,
}
interface PopupModalProps {
  show: boolean,
  setShow: React.Dispatch<React.SetStateAction<boolean>>,
  content: PopupModalContent,
  handleSubmit: Function,
  error?: string
}
/**
 * A dismissible popup modal with  a title, content, and submit action customizable via props.
 */
const PopupModal: React.FC<PopupModalProps> = ({ show, setShow, content, handleSubmit, error }: PopupModalProps) => {
 
  const handleShow = (): void => {
    setShow(!show);
  }
  return (
    <div>
      <Modal size={content.size} show={show} onHide={handleShow}>
        <Modal.Header closeButton>
          <h5>{content.title}</h5>
        </Modal.Header>
        <Modal.Body>{content.body}</Modal.Body>
        <Modal.Footer>
          <Button
            type='submit'
            className='rounded-pill'
            variant='primary'
            onClick={() => {
              handleSubmit();
            }}
          >
            {content.submitLabel}
            {/* <i className='fas fa-spinner fa-pulse'></i> */}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PopupModal;

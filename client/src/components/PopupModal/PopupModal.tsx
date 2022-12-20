import React, { memo } from 'react';
import { Modal, ModalFooter } from 'react-bootstrap';
import ActionButton from '../ActionButton/ActionButton';

interface PopupModalProps {
  title: string | JSX.Element;
  show: boolean;
  size: 'sm' | 'lg';
  setShow: () => void;
  locked?: boolean;
  children?: React.ReactNode;
  closeButton?: boolean;
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
  closeButton,
  children,
}) => {
  const handleShow = (): void => {
    setShow();
  };
  return (
    <Modal
      id='modal'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal_title'
      aria-describedby='modal_body'
      size={size}
      show={show}
      onHide={handleShow}
      backdrop={locked ? 'static' : true}
    >
      <Modal.Header closeButton={locked ? false : true}>
        <h2 id='modal_title'>{title}</h2>
      </Modal.Header>
      <Modal.Body id='modal_body'>{children && children}</Modal.Body>
      <ModalFooter>
        {closeButton && (
          <ActionButton
            position='right'
            color='secondary'
            submitAction={setShow}
            label='Close'
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default memo(PopupModal);

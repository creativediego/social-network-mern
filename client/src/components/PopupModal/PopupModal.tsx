import React, { memo } from 'react';
import { Modal, ModalFooter } from 'react-bootstrap';
import ActionButton from '../ActionButton/ActionButton';

interface PopupModalProps {
  title: string | JSX.Element;
  show: boolean;
  size: 'sm' | 'lg';
  closeModal: () => void;
  action?: () => void;
  actionLabel?: string;
  locked?: boolean;
  children?: React.ReactNode;
  withClose?: boolean;
  loading?: boolean;
}
/**
 * A dismissible popup modal with  a title, content, and submit action customizable via props.
 */
const PopupModal: React.FC<PopupModalProps> = ({
  title,
  show,
  size,
  locked,
  withClose,
  actionLabel,
  loading,
  children,
  closeModal,
  action,
}) => {
  return (
    <Modal
      id='modal'
      role='dialog'
      aria-modal='true'
      aria-labelledby='modal_title'
      aria-describedby='modal_body'
      size={size}
      show={show}
      onHide={closeModal}
      backdrop={locked ? 'static' : true}
    >
      <Modal.Header closeButton={locked ? false : true}>
        <h2 id='modal_title'>{title}</h2>
      </Modal.Header>
      <Modal.Body id='modal_body'>{children && children}</Modal.Body>
      <ModalFooter>
        {withClose && (
          <ActionButton
            position='right'
            color='secondary'
            submitAction={closeModal}
            label='Close'
          />
        )}
        {action && (
          <ActionButton
            position='right'
            color='primary'
            label={actionLabel ? actionLabel : 'Submit'}
            submitAction={action}
            loading={loading}
          />
        )}
      </ModalFooter>
    </Modal>
  );
};

export default memo(PopupModal);

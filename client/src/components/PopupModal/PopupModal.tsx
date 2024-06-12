import { memo, ReactNode } from 'react';
import { Modal, ModalFooter } from 'react-bootstrap';
import SubmitButton from '../SubmitButton/SubmitButton';

/**
 * `PopupModalProps` is an interface for the properties of the `PopupModal` component.
 *
 * @property {string | JSX.Element} title - The title of the modal.
 * @property {boolean} show - A boolean indicating whether the modal is visible.
 * @property {'sm' | 'lg'} size - The size of the modal.
 * @property {() => void} [closeModal] - An optional function to close the modal.
 * @property {() => void} [action] - An optional function to be executed when the action button is clicked.
 * @property {string} [actionLabel] - An optional label for the action button.
 * @property {boolean} [locked] - An optional boolean indicating whether the modal is locked.
 * @property {ReactNode} [children] - The children to be rendered in the modal.
 * @property {boolean} [withClose] - An optional boolean indicating whether the modal has a close button.
 * @property {boolean} [loading] - An optional boolean indicating whether the modal is loading.
 */
interface PopupModalProps {
  title: string | JSX.Element;
  show: boolean;
  size: 'sm' | 'lg';
  closeModal?: () => void;
  action?: () => void;
  actionLabel?: string;
  locked?: boolean;
  children?: ReactNode;
  withClose?: boolean;
  loading?: boolean;
}

/**
 * `PopupModal` is a component that renders a dismissible popup modal with a title, content, and submit action customizable via props.
 * It uses the `Modal` and `ModalFooter` components from React Bootstrap to render the modal and its footer, and the `SubmitButton` component to render the action button.
 *
 * @param {PopupModalProps} props - The properties passed to the component.
 *
 * @returns {JSX.Element} The `PopupModal` component, which includes a modal with a title, content, and an optional action button.
 *
 * @example
 * <PopupModal title="Modal Title" show={showModal} size="lg" closeModal={handleCloseModal} action={handleSubmit} actionLabel="Submit" locked={isLocked} withClose={true} loading={isLoading}>
 *   <p>Modal content</p>
 * </PopupModal>
 *
 * @see {@link PopupModalProps} for the interface of the properties.
 * @see {@link Modal} and {@link ModalFooter} for the components that render the modal and its footer.
 * @see {@link SubmitButton} for the component that renders the action button.
 */
const PopupModal = ({
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
}: PopupModalProps) => {
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
        <h6 id='modal_title'>{title}</h6>
      </Modal.Header>
      <Modal.Body id='modal_body'>{children && children}</Modal.Body>
      <ModalFooter>
        {withClose && (
          <SubmitButton
            position='right'
            color='secondary'
            submitAction={closeModal}
            label='Close'
          />
        )}
        {action && (
          <SubmitButton
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

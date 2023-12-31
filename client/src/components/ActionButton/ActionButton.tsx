import React, { memo } from 'react';
import { Button } from 'react-bootstrap';
import Loader from '../Loader/Loader';

/**
 * ActionButtonProps defines the props for the ActionButton component.
 * label: Text to display on the button (optional, defaults to 'Submit').
 * submitAction: Function triggered on button click (optional).
 * position: Specifies the button's alignment - 'right' or 'left'.
 * color: Specifies the button's color scheme - 'primary' or 'secondary' (optional, defaults to 'primary').
 * loading: Flag indicating whether the button is in a loading state (optional).
 */
export interface ActionButtonProps {
  label?: string;
  submitAction?: () => void;
  position: 'right' | 'left';
  color?: 'primary' | 'secondary';
  loading?: boolean;
}

/**
 * ActionButton is a reusable component that renders a customizable button with loading state support.
 * It accepts label, position, color, loading state, and a submit action.
 * Utilizes Bootstrap's Button component and Loader component for loading state.
 */
const ActionButton = ({
  submitAction,
  label,
  position,
  color,
  loading,
}: ActionButtonProps) => {
  return (
    <span className={`fa-pull-${position} mt-2`}>
      <Button
        disabled={loading}
        type='submit'
        className='rounded-pill fw-bold'
        variant={color || 'primary'}
        onClick={() => {
          if (submitAction) submitAction();
        }}
        data-testid='action-button'
      >
        {loading ? <Loader loading={loading} /> : <>{label || 'Submit'}</>}
      </Button>
    </span>
  );
};

export default memo(ActionButton);

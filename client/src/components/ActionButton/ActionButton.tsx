import React, { memo } from 'react';
import { Button } from 'react-bootstrap';
import Loader from '../Loader/Loader';

export interface ActionButtonProps {
  label?: string;
  submitAction: () => void;
  position: 'right' | 'left';
  color?: 'primary' | 'secondary';
  loading?: boolean;
}

/**
 * Generic action button that takes a label, position, color, loading state, and submit action.
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
        type='submit'
        className='rounded-pill'
        variant={color || 'primary'}
        onClick={() => {
          submitAction();
        }}
        data-testid='action-button'
      >
        {loading ? <Loader loading={loading} /> : <>{label || 'Submit'}</>}
      </Button>
    </span>
  );
};

export default memo(ActionButton);

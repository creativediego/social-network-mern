import React, { memo } from 'react';
import { Color } from 'react-bootstrap/esm/types';

interface LoaderProps {
  loading: boolean;
  message?: string;
  content?: string;
  size?: string;
  color?: string;
}
/**
 * Displays spinning loader with optional message and alternative content when loader is inactive.
 */
const Loader = ({
  loading,
  message,
  content,
  size,
  color,
}: LoaderProps): JSX.Element => {
  return (
    <span className='d-flex justify-content-center'>
      {loading && message ? <span className='me-2'>{message} </span> : null}
      {loading && (
        <span>
          <i
            className={`fas fa-spinner fa-pulse ${size ? size : 'fs-5'}`}
            style={{ color }}
          ></i>
        </span>
      )}
      {!loading && content}
    </span>
  );
};

export default memo(Loader);

import React from 'react';

/**
 * Displays spinning loader with optional message and alternative content when loader is inactive.
 */
const Loader = ({ loading, message, content, size }) => {
  return (
    <span className='d-flex justify-content-center'>
      {loading && message ? <span className='me-2'>{message} </span> : null}
      {loading && (
        <span>
          <i className={`fas fa-spinner fa-pulse ${size ? size : 'fs-5'}`}></i>
        </span>
      )}
      {!loading && content}
    </span>
  );
};

export default Loader;

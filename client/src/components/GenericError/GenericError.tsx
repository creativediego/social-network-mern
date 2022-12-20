import React from 'react';

/**
 * Generic error content that can be added to a landing page..
 *
 */
const GenericError = (): JSX.Element => {
  return (
    <div>
      <h1>Oooops! Something went wrong.</h1>
      <a
        href={process.env.REACT_APP_CLIENT_URL}
        className='btn btn-primary rounded-pill'
      >
        Return to home page
      </a>
    </div>
  );
};

export default GenericError;

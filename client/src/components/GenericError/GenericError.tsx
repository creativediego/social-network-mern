import React from 'react';

/**
 * Generic error content that can be added to a landing page..
 *
 */
import { configENV } from '../../config/appConfig';
const GenericError = (): JSX.Element => {
  return (
    <div>
      <h1>Oooops! Something went wrong.</h1>
      <a href={configENV.baseURL} className='btn btn-primary rounded-pill'>
        Return to home page
      </a>
    </div>
  );
};

export default GenericError;

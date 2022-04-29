import React, { useContext } from 'react';
import { TuitContext } from './Tuit';

/**
 * Displays an image post of a tuit.
 */
const TuitImage = () => {
  const [tuit] = useContext(TuitContext);

  return (
    <div className='position-relative'>
      <img
        src={`../images/${tuit.image}`}
        className='mt-2 w-100 ttr-rounded-15px'
        alt='Tuit'
      />
      {tuit.imageOverlay && (
        <span
          className={`fa-2x text-white fw-bold bottom-0
                      ttr-tuit-image-overlay position-absolute`}
        >
          {tuit.imageOverlay}
        </span>
      )}
    </div>
  );
};
export default TuitImage;

import React, { useContext, useEffect, useState } from 'react';
import { TuitContext } from './Tuit';

/**
 * Displays an image post of a tuit.
 */
const TuitImage = ({ imageURL, deletable }) => {
  const [image, setImage] = useState(imageURL);
  useEffect(() => {
    setImage(imageURL);
  }, [imageURL]);
  return (
    <div className='position-relative'>
      {image && (
        <div
          style={{
            backgroundImage: `url('${image}')`,
            aspectRatio: 'auto 1/1',
            backgroundRepeat: 'no-repeat',
            borderRadius: '1rem',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {imageURL && deletable && (
            <span
              className={`fa-2x text-white fw-bold 
                      ttr-tuit-image-overlay position-absolute m-2 top-0`}
            >
              <i
                className='fa-solid fa-circle-xmark text-dark'
                style={{ cursor: 'pointer' }}
                onClick={() => setImage(undefined)}
              ></i>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default TuitImage;

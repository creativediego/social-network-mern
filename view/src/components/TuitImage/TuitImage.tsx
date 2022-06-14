import * as React from 'react';
import './TuitImage.scss';
/**
 * Displays an image post of a tuit.
 */
interface TuitImageProps {
  imageURL: string | undefined;
  deletable: boolean;
}
const TuitImage: React.FC<TuitImageProps> = ({
  imageURL,
  deletable,
}): JSX.Element => {
  const [image, setImage] = React.useState(imageURL);
  React.useEffect(() => {
    setImage(imageURL);
  }, [imageURL]);
  return (
    <div className='position-relative'>
      {image && (
        <div
          className='ttr-image-file'
          style={{
            backgroundImage: `url('${image}')`,
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
                onClick={() => setImage('')}
              ></i>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default TuitImage;

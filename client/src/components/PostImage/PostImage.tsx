import React, { memo, useEffect } from 'react';
import './PostImage.scss';
/**
 * Displays an image post of a post.
 */
interface PostImageProps {
  imageURL: string | undefined;
  deletable: boolean;
}
const PostImage = ({ imageURL, deletable }: PostImageProps): JSX.Element => {
  const [image, setImage] = React.useState(imageURL);
  useEffect(() => {
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
                      ttr-post-image-overlay position-absolute m-2 top-0`}
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
export default memo(PostImage);

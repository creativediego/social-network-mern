import { memo, useEffect, useState } from 'react';
import './PostImage.scss';

/**
 * Displays an image post within a post.
 *
 * @param {Object} props - The props for the PostImage component.
 * @param {string | undefined} props.imageURL - The URL of the image to display.
 * @param {boolean} props.deletable - Indicates whether the image can be deleted.
 * @returns {JSX.Element} JSX for displaying the image post.
 */
interface PostImageProps {
  imageURL: string | undefined;
  deletable: boolean;
}
const PostImage = ({ imageURL, deletable }: PostImageProps): JSX.Element => {
  const [image, setImage] = useState(imageURL);

  // Update image display when imageURL changes
  useEffect(() => {
    setImage(imageURL);
  }, [imageURL]);

  return (
    <div className='position-relative'>
      {/* Display the image if imageURL is available */}
      {image && (
        <div
          className='ttr-image-file'
          style={{
            backgroundImage: `url('${image}')`,
          }}
        >
          {/* Render delete option if imageURL exists and deletable is true */}
          {imageURL && deletable && (
            <span
              className={`fa-2x text-white fw-bold 
                      ttr-post-image-overlay position-absolute m-2 top-0`}
            >
              {/* Delete icon - allows users to remove the image */}
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

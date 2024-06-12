import { memo } from 'react';
import './AvatarUpload.scss';
import { ImageUploadProps } from './AvatarUpload';

/**
 * `HeaderImageUpload` is a component that displays the user's header image and provides upload functionality.
 * It takes in `imagePreview`, `user`, and `children` as properties.
 * The `imagePreview` string is used as the URL of the image to display.
 * The `user` object is used to get the user's header image if `imagePreview` is not provided.
 * The `children` element is expected to be an `input` element for the file upload.
 *
 * @param {ImageUploadProps} props - The properties passed to the component.
 * @param {string | undefined} props.imagePreview - The URL of the image to display.
 * @param {IUser} props.user - The user object to get the header image from.
 * @param {ReactElement<HTMLInputElement>} props.children - The `input` element for the file upload.
 *
 * @returns {JSX.Element} The `HeaderImageUpload` component, which includes the user's header image and the file upload functionality.
 *
 * @example
 * <HeaderImageUpload imagePreview={imagePreview} user={user}>
 *   <input type="file" />
 * </HeaderImageUpload>
 */
const HeaderImageUpload = ({
  user,
  imagePreview,
  children,
}: ImageUploadProps) => {
  const imageURL = imagePreview || user.headerImage;

  return (
    <div
      className='d-flex flex-column header-image-container bg-dark d-flex justify-content-center align-items-center'
      style={{
        backgroundImage: imageURL ? `url(${imageURL})` : 'none',
        backgroundSize: 'cover',
      }}
    >
      <label
        htmlFor='headerImage'
        className='position-relative bg-white d-flex align-items-center justify-content-center'
      >
        <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
          <i className='fa-solid fa-camera'></i>
        </div>
      </label>
      {children}
    </div>
  );
};

export default memo(HeaderImageUpload);

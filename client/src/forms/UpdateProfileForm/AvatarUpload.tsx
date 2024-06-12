import { memo, ReactElement } from 'react';
import { AvatarImage } from '../../components';
import './AvatarUpload.scss';
import { IUser } from '../../interfaces/IUser';

export interface ImageUploadProps {
  imagePreview: string | undefined;
  user: IUser;
  children: ReactElement<HTMLInputElement>;
}

/**
 * `AvatarUpload` is a component that displays the user's profile photo and provides upload functionality.
 * It takes in `imagePreview`, `user`, and `children` as properties.
 * The `imagePreview` string is used as the URL of the image to display.
 * The `user` object is used to get the user's profile photo if `imagePreview` is not provided.
 * The `children` element is expected to be an `input` element for the file upload.
 *
 * @param {ImageUploadProps} props - The properties passed to the component.
 * @param {string | undefined} props.imagePreview - The URL of the image to display.
 * @param {IUser} props.user - The user object to get the profile photo from.
 * @param {ReactElement<HTMLInputElement>} props.children - The `input` element for the file upload.
 *
 * @returns {JSX.Element} The `AvatarUpload` component, which includes the user's profile photo and the file upload functionality.
 *
 * @example
 * <AvatarUpload imagePreview={imagePreview} user={user}>
 *   <input type="file" />
 * </AvatarUpload>
 */

const AvatarUpload = ({
  imagePreview,
  user,
  children,
}: ImageUploadProps): JSX.Element => {
  const avatar =
    imagePreview || user.profilePhoto || '/images/default-avatar.png';
  return (
    <div className='left-0 position-absolute avatar-container  '>
      <div className='position-relative justify-content-center align-items-center d-flex'>
        <div className='ratio ratio-1x1 rounded-circle overflow-hidden  d-flex align-items-center'>
          <label
            htmlFor='profilePhoto'
            className='position-relative  d-flex align-items-center justify-content-center'
          >
            <div></div>
            <div className='d-flex align-items-center justify-content-center'>
              <AvatarImage profilePhoto={avatar} size={150} />
              <div className='position-absolute  h-20 w-20 d-flex avatar-icon align-items-center justify-content-center'>
                <i className='fa-solid fa-camera'></i>
              </div>
            </div>
          </label>
          {children}
        </div>
      </div>
    </div>
  );
};

export default memo(AvatarUpload);

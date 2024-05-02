import React, { memo } from 'react';

/**
 * `AvatarImage` is a component that renders a user's avatar image.
 *
 * It accepts two props: `profilePhoto` and `size`.
 * - `profilePhoto` is a string representing the URL of the user's profile photo.
 * - `size` is a number representing the height and width of the image in pixels.
 *
 * If no `profilePhoto` is provided, it defaults to a default avatar image.
 *
 * @component
 * @example
 * Example usage of AvatarImage component
 * <AvatarImage profilePhoto="http://example.com/profile.jpg" size={50} />
 *
 * @param {AvatarImageProps} props - The properties that define the AvatarImage component.
 * @param {string} props.profilePhoto - The URL of the user's profile photo.
 * @param {number} props.size - The height and width of the image in pixels.
 *
 * @returns {JSX.Element} A JSX element representing the user's avatar image.
 */
interface AvatarImageProps {
  profilePhoto: string | undefined;
  size: Number;
}
const AvatarImage = ({ profilePhoto, size }: AvatarImageProps): JSX.Element => {
  const defaultAvatar = profilePhoto
    ? profilePhoto
    : '../images/default-avatar.png';
  return (
    <div
      className='position-relative'
      style={{ height: `${size}px`, width: `${size}px` }}
    >
      <img
        className='position-relative h-100 img-fluid  rounded-circle bg-white img-fluid'
        alt='profile photo'
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          height: `${size}px`,
          width: `${size}px`,
          border: 'black solid 5px',
        }}
        src={`${defaultAvatar}`}
      />
    </div>
  );
};

export default memo(AvatarImage);

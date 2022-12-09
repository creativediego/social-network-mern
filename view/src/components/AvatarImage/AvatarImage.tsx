import React, { memo } from 'react';

interface AvatarImageProps {
  profilePhoto: string;
  size: Number;
}
export const AvatarImage = memo(
  ({ profilePhoto, size }: AvatarImageProps): JSX.Element => {
    return (
      <div
        className='position-relative'
        style={{ height: `${size}px`, width: `${size}px` }}
      >
        <img
          className='position-relative h-100 img-fluid  rounded-circle bg-white img-fluid'
          alt='user profile'
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            height: `${size}px`,
            width: `${size}px`,
            border: 'black solid 5px',
          }}
          src={`${profilePhoto || `../images/default-avatar.png`}`}
        />
      </div>
    );
  }
);
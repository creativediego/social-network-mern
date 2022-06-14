import * as React from 'react';

interface AvatarImageProps {
  profilePhoto: string,
  size: Number
}
const AvatarImage: React.FC<AvatarImageProps> = ({ profilePhoto, size }): JSX.Element => {
  return (
    <div className='position-relative' style={{ height:`${size}px`, width:`${size}px` }}>
      <img
        className='position-relative h-100 img-fluid  rounded-circle bg-white img-fluid'
        alt='user profile'
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          height:`${size}px`,
          width:`${size}px`,
          border: 'black solid 5px',
        }}
        src={`${profilePhoto || `../images/default-avatar.png`}`}
      />
    </div>
  );
};

export default AvatarImage;

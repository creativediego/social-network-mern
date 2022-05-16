import React from 'react';

const AvatarImage = ({ user, width, height }) => {
  return (
    <div className='position-relative' style={{ height, width }}>
      <img
        className='position-relative h-100 img-fluid  rounded-circle bg-white img-fluid'
        alt='user profile'
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          height,
          width,
          border: 'black solid 5px',
        }}
        src={`${user.profilePhoto || `../images/default-avatar.png`}`}
      />
    </div>
  );
};

export default AvatarImage;

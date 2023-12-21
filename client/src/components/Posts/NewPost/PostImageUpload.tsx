import React, { memo } from 'react';

interface PostImageUploadProps {
  setImageFile: (file: File | null) => void;
}

const PostImageUpload: React.FC<PostImageUploadProps> = ({
  setImageFile,
}): JSX.Element => {
  return (
    <>
      <label htmlFor='postImageFile' title='Media'>
        <i className='fas fa-image me-3' style={{ cursor: 'pointer' }}></i>
      </label>
      <input
        onChange={(e) => {
          if (e.target.files) {
            setImageFile(e.target.files[0]);
          }
          e.target.value = '';
        }}
        type='file'
        style={{ display: 'none' }}
        id='postImageFile'
      />
    </>
  );
};

export default memo(PostImageUpload);

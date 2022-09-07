import React, { memo } from 'react';

interface TuitImageUploadProps {
  setImageFile: (file: File | null) => void;
}

const TuitImageUpload: React.FC<TuitImageUploadProps> = ({
  setImageFile,
}): JSX.Element => {
  return (
    <>
      <label htmlFor='tuitImageFile' title='Media'>
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
        id='tuitImageFile'
      />
    </>
  );
};

export default memo(TuitImageUpload);

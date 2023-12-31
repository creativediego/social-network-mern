import React, { memo } from 'react';

/**
 * Component for uploading an image for a post.
 *
 * @param {Object} props - The props for the PostImageUpload component.
 * @param {Function} props.setImageFile - Callback function to set the selected image file.
 * @returns {JSX.Element} JSX for uploading an image for a post.
 */
interface PostImageUploadProps {
  setImageFile: (file: File | null) => void;
}

const PostImageUpload: React.FC<PostImageUploadProps> = ({
  setImageFile,
}): JSX.Element => {
  /**
   * Handles the file selection when an image is uploaded.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by file selection.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Set the selected image file using the provided callback function
      setImageFile(e.target.files[0]);
    }
    e.target.value = ''; // Clear the input value to allow re-uploading the same file
  };

  return (
    <>
      {/* Label for the file input */}
      <label htmlFor='postImageFile' title='Media'>
        <i className='fas fa-image me-3' style={{ cursor: 'pointer' }}></i>
      </label>

      {/* File input for selecting an image */}
      <input
        onChange={handleFileChange}
        type='file'
        style={{ display: 'none' }}
        id='postImageFile'
      />
    </>
  );
};

export default memo(PostImageUpload);

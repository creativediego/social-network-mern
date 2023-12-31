import React from 'react';
import PostImage from '../PostImage/PostImage';
import PostImageUpload from './PostImageUpload';
import useNewPost from './useNewPost';
import ActionButton from '../../ActionButton/ActionButton';

/**
 * Displays a form for a user to submit a new post.
 *
 * Manages the input fields for creating a new post, including text content and image upload.
 *
 * @returns {JSX.Element} JSX for the new post form
 */
const NewPost = (): JSX.Element => {
  const {
    post,
    loading,
    handleInputChange,
    handleSetImageFile,
    handleCreatePost,
    imagePreview,
  } = useNewPost();

  return (
    <div className='p-2 w-100'>
      {/* Text area for entering post content */}
      <textarea
        onChange={handleInputChange}
        placeholder="What's happening?"
        className='w-100 border-0 p-2'
        value={post.post}
      ></textarea>

      {/* Display hashtags if available */}
      {post.hashtags && (
        <div>
          {post.hashtags.map((hashtag, index) => (
            <span
              key={index}
              className='text-primary fw-bold fs-5'
              style={{ cursor: 'pointer' }}
            >
              {hashtag}{' '}
            </span>
          ))}
        </div>
      )}

      {/* Display the selected image */}
      {<PostImage imageURL={imagePreview} deletable={true} />}

      <div className='row'>
        <div className='col-10 ttr-font-size-150pc text-primary mt-4'>
          {/* Component to upload an image */}
          <PostImageUpload setImageFile={handleSetImageFile} />
        </div>
        <div className='col-2 mt-4'>
          <ActionButton
            submitAction={handleCreatePost}
            label='Post'
            position='right'
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default NewPost;

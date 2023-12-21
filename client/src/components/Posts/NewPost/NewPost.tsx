import React from 'react';
import PostImage from '../../PostImage/PostImage';
import PostImageUpload from './PostImageUpload';
import useNewPost from './useNewPost';

/**
 * Displays form for a user to submit a new post.
 */
const NewPost = () => {
  const { post, setInput, setImageFile, createPost, imagePreview } =
    useNewPost();
  return (
    <div className='p-2 w-100'>
      <textarea
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e)}
        placeholder="What's happening?"
        className='w-100 border-0 p-2'
        value={post.post}
      ></textarea>
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
      {<PostImage imageURL={imagePreview} deletable={true} />}
      <div className='row'>
        <div className='col-10 ttr-font-size-150pc text-primary mt-4'>
          <PostImageUpload setImageFile={setImageFile} />
          {/* <i className='fas fa-image me-3'></i> */}
          {/* <i className='far fa-gif me-3'></i>
          <i className='far fa-bar-chart me-3'></i>
          <i className='far fa-face-smile me-3'></i>
          <i className='far fa-calendar me-3'></i>
          <i className='far fa-map-location me-3'></i> */}
        </div>
        <div className='col-2 mt-4'>
          <button
            onClick={() => createPost(post)}
            className={`btn btn-primary rounded-pill fa-pull-right
                                  fw-bold ps-4 pe-4`}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPost;

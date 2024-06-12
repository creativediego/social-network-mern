import './NewPost.scss';
import PostImage from '../PostImage/PostImage';
import PostImageUpload from './PostImageUpload';
import useNewPost from './useNewPost';
import SubmitButton from '../../SubmitButton/SubmitButton';

/**
 * `NewPost` is a component that renders a form for creating a new post.
 * It uses the `useNewPost` custom hook to get the state and actions for the new post, and the `PostImage` and `PostImageUpload` components to render the post image and the image upload field.
 * It includes a text area for entering the post content, and a `SubmitButton` component for submitting the form.
 *
 * @returns {JSX.Element} The `NewPost` component, which includes a form for creating a new post.
 *
 * @example
 * <NewPost />
 *
 * @see {@link useNewPost} for the custom hook that provides the state and actions for the new post.
 * @see {@link PostImage} and {@link PostImageUpload} for the components that render the post image and the image upload field.
 * @see {@link SubmitButton} for the component that renders the submit button.
 */
const NewPost = (): JSX.Element => {
  const {
    post,
    loading,
    handleInputChange,
    handleSetPostImage,
    handleCreatePost,
    imagePreview,
    errors,
  } = useNewPost();

  return (
    <div className='p-2 w-100'>
      {/* Text area for entering post content */}
      {
        <textarea
          id='new-post'
          onChange={handleInputChange}
          placeholder="What's happening?"
          className='w-100 border-0 p-2'
          value={post.post}
        ></textarea>
      }

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
          <PostImageUpload setImageFile={handleSetPostImage} />
        </div>
        <div className='col-2 mt-4'>
          <SubmitButton
            submitAction={handleCreatePost}
            label='Post'
            position='right'
            loading={loading}
          />
        </div>
      </div>
      {errors.length > 0 &&
        errors.map((error, index) => (
          <p className='alert alert-warning mt-3' key={index}>
            {error}
          </p>
        ))}
    </div>
  );
};

export default NewPost;

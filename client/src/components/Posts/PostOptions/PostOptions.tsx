import React from 'react';
import '.././Posts.scss';
import { usePost } from '../Post/hooks/usePost';
import { usePostDeletion } from './hooks/usePostDeletion';
import { usePostOptions } from './hooks/usePostOptions';

/**
 * `PostOptions` is a component that displays the dropdown menu options when clicking the post ellipsis button.
 *
 * It uses the `usePost`, `usePostOptions`, and `usePostDeletion` hooks to manage the post options and actions.
 *
 * @component
 * @example
 * Example usage of PostOptions component
 * <PostOptions />
 *
 * @returns {JSX.Element} A JSX element representing the post options.
 */
const PostOptions = (): JSX.Element => {
  const { post } = usePost();
  const { showMenu, handleShowOptions } = usePostOptions();
  const { handleDeletePost } = usePostDeletion(post);
  return (
    <>
      {showMenu && (
        <div
          className='ttr-dismiss-layer'
          onClick={() => handleShowOptions(false)}
        ></div>
      )}
      <div className='dropdown d-flex align-items-center justify-content-end position-relative'>
        <div className='btn' onClick={() => handleShowOptions(true)}>
          <i className='fa-solid fa-ellipsis'></i>
        </div>
        {showMenu && (
          <div className='position-absolute w-50 h-100 '>
            <ul className='trr-post-more-button dropdown-menu w-100 bg-black border border-white'>
              <li className='text-danger' onClick={() => handleDeletePost()}>
                <span className='d-flex align-items-center'>
                  <i
                    className={`text-danger fa-duotone fa-trash-xmark btn fa-2x fs-6 `}
                  ></i>
                  Delete Post
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default PostOptions;

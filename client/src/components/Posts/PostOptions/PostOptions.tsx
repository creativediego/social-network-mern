import React from 'react';
import { usePost } from '../../../hooks/usePost';
import '.././Posts.scss';

/**
 * Shows the dropdown menu options when clicking the post ellipsis button.
 */
const PostOptions = (): JSX.Element | null => {
  const { post, showMenu, handleShowOptions, handleDeletePost } = usePost();
  return (
    post && (
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
    )
  );
};

export default PostOptions;

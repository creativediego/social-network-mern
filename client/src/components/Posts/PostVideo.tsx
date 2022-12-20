import * as React from 'react';
import { usePost } from '../../hooks/usePost';

/**
 * Displays a video post of a post.
 */
const PostVideo: React.FC = (): JSX.Element | null => {
  const { post } = usePost();
  return post ? (
    <div className='ttr-responsive-video ttr-rounded-15px position-relative overflow-hidden w-100 mt-2'>
      <iframe
        width='560'
        height='315'
        src={post.youtube}
        title='YouTube video player'
        frameBorder='0'
        className='position-absolute top-0 w-100 h-100'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen
      ></iframe>
    </div>
  ) : null;
};
export default PostVideo;

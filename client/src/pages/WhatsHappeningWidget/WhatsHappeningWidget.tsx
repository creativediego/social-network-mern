import './WhatsHappeningView.css';
import moment from 'moment';
import PostContent from '../../components/Posts/Post/PostContent';
import { Link } from 'react-router-dom';
import { useTopPosts } from './useTopPosts';
import { Loader } from '../../components';

/**
 * `WhatsHappeningWidget` is a functional component that displays a list of popular posts.
 * It uses the `useTopPosts` hook to fetch the top 5 posts.
 * The `Loader` component is displayed while the posts are loading.
 * Each post is displayed with its creation time in a human-readable format using the `moment` library.
 * The creation time is displayed in a `h3` element with the classes `fs-6` and `fw-lighter`.
 * The `post.id` is used as the key for each post element.
 *
 * @returns {JSX.Element} A `div` element with the class `ttr-whats-happening p-2` that contains the list of popular posts.
 *
 * @example
 * <WhatsHappeningWidget />
 *
 * @see {@link useTopPosts} for the hook that fetches the top posts.
 * @see {@link Loader} for the component that displays the loading state.
 * @see {@link moment} for the library that formats the creation time.
 */

const WhatsHappeningWidget = (): JSX.Element => {
  const { posts, loading } = useTopPosts(5);

  return (
    <div className='ttr-whats-happening p-2'>
      {/* <div className='ttr-search position-relative'>
        <i className='fas fa-search position-absolute'></i>
        <input
          className='bg-secondary bg-opacity-10 border-0 form-control form-control-lg rounded-pill ps-5'
          placeholder='Search Poster'
        />
      </div> */}
      <div className='bg-secondary bg-opacity-10 ttr-rounded-15px mt-2 p-2'>
        <h5>Popular Posts</h5>
        {loading && <Loader loading={loading} />}
        {posts.map((post) => {
          return (
            <div key={post.id} className='ttr-whats-happening-post d-flex mb-3'>
              <div className='flex-grow-1'>
                <h3 className='fs-6 fw-lighter'>
                  {moment(post.createdAt).fromNow()}
                </h3>
                <div className='fw-bold mb-2 pe-1'>
                  <PostContent content={post.post.split(' ')} />
                </div>
                <h4 className='fs-6 fw-lighter'>
                  <i className='far fa-heart ttr-stat-icon'></i>{' '}
                  {post.stats.likes} likes
                </h4>
              </div>
              <Link to={`/${post.author.username}/posts`}>
                <div>
                  <img
                    alt='user avatar'
                    src={post.author.profilePhoto}
                    className='ttr-rounded-15px ttr-user-logo'
                  />
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default WhatsHappeningWidget;

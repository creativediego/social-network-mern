import { Link } from 'react-router-dom';

/**
 * `PostContent` is a component that renders the content of a post.
 * It splits the content into words and maps over them, rendering each word as a link if it starts with a hashtag and as a span otherwise.
 * The link leads to a search page with the hashtag as the query, and it is styled with the 'text-decoration-none' and 'text-primary' classes.
 *
 * @param {{ content: string[] }} props - The properties passed to the component.
 * @param {string[]} props.content - The content of the post, split into words.
 *
 * @returns {JSX.Element} The `PostContent` component, which includes the content of the post with hashtags styled and linked.
 *
 * @example
 * <PostContent content={content} />
 *
 * @see {@link Link} for the component that renders the link.
 */
const PostContent = ({ content }: { content: string[] }) => {
  return (
    <>
      {content.map((word, index) =>
        word[0] === '#' ? ( // style the hashtag word and create link
          <Link
            to={`/search/?q=${word.split('#')[1]}`} // exclude hash from url
            className='text-decoration-none'
            key={index}
          >
            <span key={index} className='text-primary'>
              {' '}
              {word}
            </span>
          </Link>
        ) : (
          <span key={index}> {word}</span>
        )
      )}
    </>
  );
};

export default PostContent;

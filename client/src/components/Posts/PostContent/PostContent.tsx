import React from 'react';
import { Link } from 'react-router-dom';

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

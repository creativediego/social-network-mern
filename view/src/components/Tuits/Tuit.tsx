import React, { memo } from 'react';
import TuitStats from './TuitStats';
import TuitImage from '../TuitImage/TuitImage';
import TuitVideo from './TuitVideo';
import { Link } from 'react-router-dom';
import { AvatarImage } from '../AvatarImage/AvatarImage';
import { ITuit } from '../../interfaces/ITuit';
import moment from 'moment';
import { TuitProvider } from '../../hooks/useTuit';
import TuitMoreButton from './TuitMoreButton';
import { useAuthUser } from '../../hooks/useAuthUser';

interface TuitProps {
  tuit: ITuit;
}
/**
 * Displays a tuit with all of its information, including Author, time, and stats (likes, dislikes, etc).
 */
const Tuit = ({ tuit }: TuitProps): JSX.Element => {
  const tuitWordArray = tuit.tuit.split(' ');
  const { user } = useAuthUser();
  return (
    tuit && (
      <>
        <TuitProvider tuit={tuit}>
          <li className='p-2 ttr-tuit list-group-item d-flex rounded-0'>
            <Link to={`/${tuit.author.username}/tuits`}>
              <div className='pe-2'>
                <AvatarImage
                  profilePhoto={tuit.author.profilePhoto}
                  size={50}
                />
              </div>
            </Link>
            <div className='w-100'>
              <div className='d-flex justify-content-between'>
                <div>
                  {/* {user.id === tuit.author.id ? ( // only delete if tuit belongs to user
                <i
                  onClick={() => handleDeleteTuit(tuit.id)}
                  className='fa-duotone fa-trash-xmark btn fa-2x fa-pull-right fs-6 text-dark'
                ></i>
              ) : null} */}
                  <p className='fw-bold ttr-tuit-title'>
                    {/* {tuit.author && tuit.author.name} */}
                    {/* This link and the one above will naviagate a user's the profile page for the user who posted this tuit.  */}
                    <Link
                      to={`/${tuit.author.username}/tuits`}
                      className='text-decoration-none'
                    >
                      {`${tuit.author.name || tuit.author.firstName} @${
                        tuit.author.username
                      } `}
                    </Link>
                    <span className='text-dark'>
                      {moment(tuit.createdAt).fromNow()}
                    </span>
                  </p>
                </div>
                {user.id === tuit.author.id && <TuitMoreButton />}
              </div>
              {tuitWordArray.map((word, index) =>
                word[0] === '#' ? ( // style the hashtag word and create link
                  <Link
                    to={`/search/?q=${word.split('#')[1]}&type=tuits`} // exclude hash from url
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
              {tuit.youtube && <TuitVideo />}
              {tuit.image && (
                <TuitImage imageURL={tuit.image} deletable={false} />
              )}
              <TuitStats />
            </div>
          </li>
        </TuitProvider>
      </>
    )
  );
};
export default memo(Tuit);

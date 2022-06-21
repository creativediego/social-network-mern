import * as React from 'react';
import TuitStats from './TuitStats';
import TuitImage from '../TuitImage/TuitImage';
import TuitVideo from './TuitVideo';
import { useDispatch, useSelector } from 'react-redux';
// @ts-ignore
import { deleteTuitThunk } from '../../redux/tuitSlice';
import { Link } from 'react-router-dom';
import AvatarImage from '../AvatarImage/AvatarImage';
import { ITuit } from '../../interfaces/ITuit';
import moment from 'moment';
const defaultContext: any[] = [];
export const TuitContext = React.createContext(defaultContext);

interface TuitProps {
  tuit: ITuit;
}
/**
 * Displays a tuit with all of its information, including Author, time, and stats (likes, dislikes, etc). Includes action to handle tuit deletion if the tuit belongs to logged in user.
 */
const Tuit: React.FC<TuitProps> = ({ tuit }): React.ReactElement => {
  const [contextTuit, setContextTuit] = React.useState(tuit);
  const tuitWordArray = contextTuit.tuit.split(' ');
  const userId = useSelector((state: any) => state.user.data.id);
  const dispatch = useDispatch();
  const handleDeleteTuit = async (tid: string) => {
    dispatch(deleteTuitThunk(contextTuit.id));
  };
  React.useEffect(() => {
    setContextTuit({
      ...tuit,
    });
  }, [tuit]);
  return (
    contextTuit && (
      <TuitContext.Provider value={[contextTuit, setContextTuit]}>
        <li className='p-2 ttr-tuit list-group-item d-flex rounded-0'>
          <Link to={`/${contextTuit.author.id}/tuits`}>
            <div className='pe-2'>
              <AvatarImage
                profilePhoto={contextTuit.author.profilePhoto}
                size={50}
              />
            </div>
          </Link>
          <div className='w-100'>
            {userId === contextTuit.author.id ? ( // only delete if tuit belongs to user
              <i
                onClick={() => handleDeleteTuit(contextTuit.id)}
                className='fa-duotone fa-trash-xmark btn fa-2x fa-pull-right fs-6 text-dark'
              ></i>
            ) : null}
            <p className='fw-bold ttr-tuit-title'>
              {/* {tuit.author && tuit.author.name} */}
              {/* This link and the one above will naviagate a user's the profile page for the user who posted this tuit.  */}
              <Link
                to={`/${contextTuit.author.id}/tuits`}
                className='text-decoration-none'
              >
                {`${contextTuit.author.name || contextTuit.author.firstName} @${
                  contextTuit.author.username
                } `}
              </Link>
              <span className='text-dark'>
                {moment(contextTuit.createdAt).fromNow()}
              </span>
            </p>
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
            {contextTuit.youtube && <TuitVideo />}
            {contextTuit.image && (
              <TuitImage imageURL={tuit.image} deletable={false} />
            )}
            <TuitStats />
          </div>
        </li>
      </TuitContext.Provider>
    )
  );
};
export default Tuit;

import React, { createContext, useState } from 'react';
import TuitStats from './TuitStats';
import TuitImage from './TuitImage';
import TuitVideo from './TuitVideo';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTuitThunk } from '../../redux/tuitSlice';
import { Link } from 'react-router-dom';
import AvatarImage from '../../views/ProfileView/AvatarImage';
import Tuits from '.';

export const TuitContext = createContext();

/**
 * Displays a tuit with all of its information, including Author, time, and stats (likes, dislikes, etc). Includes action to handle tuit deletion if the tuit belongs to logged in user.
 */
const Tuit = ({ tuitFromList }) => {
  const [tuit, setTuit] = useState(tuitFromList);
  const userId = useSelector((state) => state.user.data.id);
  const dispatch = useDispatch();
  const handleDeleteTuit = async (tid) => {
    dispatch(deleteTuitThunk(tuit.id));
  };
  return (
    tuit && (
      <TuitContext.Provider value={[tuit, setTuit]}>
        <li className='p-2 ttr-tuit list-group-item d-flex rounded-0'>
          <Link to={`/${tuit.author.id}/tuits`}>
            <div className='pe-2'>
              <AvatarImage user={tuit.author} width='50px' height='50px' />
            </div>
          </Link>
          <div className='w-100'>
            {userId === tuit.author.id ? ( // only delete if tuit belongs to user
              <i
                onClick={() => handleDeleteTuit(tuit.id)}
                className='fa-duotone fa-trash-xmark btn fa-2x fa-pull-right fs-6 text-dark'
              ></i>
            ) : null}
            <p className='fw-bold ttr-tuit-title'>
              {/* {tuit.author && tuit.author.name} */}
              {/* This link and the one above will naviagate a user's the profile page for the user who posted this tuit.  */}
              <Link
                to={`/${tuit.author.id}/tuits`}
                className='text-decoration-none'
              >
                {`${tuit.author.name || tuit.author.firstName} @${
                  tuit.author.username
                } `}
              </Link>
              <span className='text-dark'>{tuit.createdAt}</span>
            </p>
            {tuit.tuit}
            {tuit.youtube && <TuitVideo />}
            {tuit.image && <TuitImage />}
            <TuitStats />
          </div>
        </li>
      </TuitContext.Provider>
    )
  );
};
export default Tuit;

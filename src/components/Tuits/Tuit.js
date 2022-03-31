import React from 'react';
import TuitStats from './TuitStats';
import TuitImage from './TuitImage';
import TuitVideo from './TuitVideo';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTuit } from '../../services/tuits-service';
import { findAllTuitsThunk } from '../../redux/tuitSlice';

const Tuit = ({ tuit }) => {
  const userId = useSelector((state) => state.user.data.id);
  const dispatch = useDispatch();
  const handleDeleteTuit = async (tid) => {
    await deleteTuit(tid);
    dispatch(findAllTuitsThunk());
  };
  return (
    <li className='p-2 ttr-tuit list-group-item d-flex rounded-0'>
      <div className='pe-2'>
        {tuit.author && (
          <img
            src={
              tuit.author.profilePhoto
                ? tuit.author.profilePhoto
                : `../images/${tuit.author.username}.jpg`
            }
            className='ttr-tuit-avatar-logo rounded-circle'
            alt='profile'
          />
        )}
      </div>
      <div className='w-100'>
        {userId === tuit.author.id ? ( // only delete if tuit belongs to user
          <i
            onClick={() => handleDeleteTuit(tuit.id)}
            className='fas btn fa-remove fa-2x fa-pull-right'
          ></i>
        ) : null}
        <p className='fs-6 fw-bold'>
          {tuit.author && tuit.author.name}@
          {tuit.author && tuit.author.username} - {tuit.createdAt}
        </p>
        {tuit.tuit}
        {tuit.youtube && <TuitVideo tuit={tuit} />}
        {tuit.image && <TuitImage tuit={tuit} />}
        <TuitStats tuit={tuit} />
      </div>
    </li>
  );
};
export default Tuit;

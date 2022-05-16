import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTuitThunk } from '../../redux/tuitSlice';
import TuitImage from '../Tuits/TuitImage';
import TuitImageUpload from './TuitImageUpload';

/**
 * Displays form where user can submit a new tuit.
 *
 */
const CreateTuit = () => {
  const userId = useSelector((state) => state.user.data.id);
  const dispatch = useDispatch();
  const [tuit, setTuit] = useState({ tuit: '', image: '', imageFile: '' });

  const createTuit = async (tuit) => {
    if (!tuit) return;
    const imageFile = tuit.imageFile;
    dispatch(createTuitThunk({ userId, tuit }));
    setTuit({ ...tuit, tuit: '', image: '' });
  };

  return (
    <div className='p-2 w-100'>
      <textarea
        onChange={(e) => setTuit({ ...tuit, tuit: e.target.value })}
        placeholder="What's happening?"
        className='w-100 border-0'
        value={tuit.tuit}
      ></textarea>
      {tuit.image && <TuitImage imageURL={tuit.image} deletable={true} />}
      <div className='row'>
        <div className='col-10 ttr-font-size-150pc text-primary mt-4'>
          <TuitImageUpload tuit={tuit} setTuit={setTuit} />
          {/* <i className='fas fa-image me-3'></i> */}
          {/* <i className='far fa-gif me-3'></i>
          <i className='far fa-bar-chart me-3'></i>
          <i className='far fa-face-smile me-3'></i>
          <i className='far fa-calendar me-3'></i>
          <i className='far fa-map-location me-3'></i> */}
        </div>
        <div className='col-2 mt-4'>
          <button
            onClick={() => createTuit(tuit)}
            className={`btn btn-primary rounded-pill fa-pull-right
                                  fw-bold ps-4 pe-4`}
          >
            Tuit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTuit;

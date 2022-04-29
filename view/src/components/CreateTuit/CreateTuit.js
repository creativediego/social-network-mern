import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTuitThunk } from '../../redux/tuitSlice';

/**
 * Displays form where user can submit a new tuit.
 *
 */
const CreateTuit = () => {
  const userId = useSelector((state) => state.user.data.id);
  const dispatch = useDispatch();
  const [tuit, setTuit] = useState('');

  const createTuit = async (tuit) => {
    if (!tuit) return;
    dispatch(createTuitThunk({ userId, tuit }));
    setTuit('');
  };

  return (
    <div className='p-2 w-100'>
      <textarea
        onChange={(e) => setTuit(e.target.value)}
        placeholder="What's happening?"
        className='w-100 border-0'
        value={tuit}
      ></textarea>
      <div className='row'>
        <div className='col-10 ttr-font-size-150pc text-primary'>
          <i className='fas fa-portrait me-3'></i>
          <i className='far fa-gif me-3'></i>
          <i className='far fa-bar-chart me-3'></i>
          <i className='far fa-face-smile me-3'></i>
          <i className='far fa-calendar me-3'></i>
          <i className='far fa-map-location me-3'></i>
        </div>
        <div className='col-2'>
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

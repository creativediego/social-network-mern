import React, { memo, useEffect } from 'react';
import './Tuits.scss';
import Tuit from './Tuit';
import { ITuit } from '../../interfaces/ITuit';
import { useAppDispatch } from '../../redux/hooks';
import { removeAllTuits } from '../../redux/tuitSlice';

interface TuitsProps {
  tuits: ITuit[];
}
/**
 * A container to display a list of tuits.
 */
const Tuits = ({ tuits }: TuitsProps): JSX.Element => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Remove all tuits when component unmounts.
    return () => {
      dispatch(removeAllTuits());
    };
  }, [dispatch]);
  return (
    <div>
      <ul className='ttr-tuits list-group'>
        {tuits &&
          Object.values(tuits).map((tuit: ITuit) => {
            return tuit ? <Tuit key={tuit.id} tuit={tuit} /> : null;
          })}
      </ul>
    </div>
  );
};

export default memo(Tuits);

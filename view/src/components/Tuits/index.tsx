import React, { memo, useEffect } from 'react';
import './Tuits.scss';
import Tuit from './Tuit';
import { IPost } from '../../interfaces/IPost';
import { useAppDispatch } from '../../redux/hooks';
import { removeAllTuits } from '../../redux/postSlice';

interface TuitsProps {
  tuits: IPost[];
  showOptions?: boolean;
}
/**
 * A container to display a list of tuits.
 */
const Tuits = ({ tuits }: TuitsProps): JSX.Element => {
  return (
    <div>
      <ul className='ttr-tuits list-group'>
        {tuits &&
          Object.values(tuits).map((tuit: IPost) => {
            return tuit ? <Tuit key={tuit.id} tuit={tuit} /> : null;
          })}
      </ul>
    </div>
  );
};

export default memo(Tuits);

import React from 'react';
import { CreateTuit, Loader, Tuits } from '../../components';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTuits, findAllTuitsThunk } from '../../redux/tuitSlice';
import AvatarImage from '../ProfileView/AvatarImage';
const HomeView = () => {
  const user = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.tuits.loading);
  const dispatch = useDispatch();
  const tuits = useSelector((state) => state.tuits.list);
  useEffect(() => {
    dispatch(clearTuits());
    dispatch(findAllTuitsThunk());
  }, [dispatch]);
  return (
    user && (
      <div className='ttr-home'>
        <div className='border border-bottom-0'>
          <h5 className='fw-bold p-2'>Home</h5>
          {user && tuits && (
            <div className='d-flex'>
              <div className='p-2'>
                <AvatarImage user={user} width='70px' height='70px' />
              </div>
              <CreateTuit />
            </div>
          )}
        </div>

        {/* {error && <ErrorBox message={error} />} */}
        <Loader loading={loading} message={'Loading Tuits'} />
        {tuits && <Tuits tuits={tuits} />}
      </div>
    )
  );
};
export default HomeView;

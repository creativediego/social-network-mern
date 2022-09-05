import React from 'react';
import { CreateTuit, Loader, Tuits, AvatarImage } from '../../components';
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { clearTuits, findAllTuitsThunk } from '../../redux/tuitSlice';
const HomeView = (): JSX.Element | null => {
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.data);
  const loading = useAppSelector((state) => state.tuits.loading);
  const dispatch = useAppDispatch();
  const tuits = useAppSelector((state) => state.tuits.list);
  useEffect(() => {
    dispatch(clearTuits());
    dispatch(findAllTuitsThunk());
  }, [dispatch]);
  return isLoggedIn ? (
    <div className='ttr-home'>
      <div className='border border-bottom-0'>
        <h5 className='fw-bold p-2'>Home</h5>
        {tuits && (
          <div className='d-flex'>
            <div className='p-2'>
              <AvatarImage profilePhoto={user.profilePhoto} size={70} />
            </div>
            <CreateTuit />
          </div>
        )}
      </div>
      <Loader loading={loading} message={'Loading Tuits'} />
      {tuits.length > 0 && <Tuits tuits={tuits} />}
    </div>
  ) : null;
};
export default HomeView;

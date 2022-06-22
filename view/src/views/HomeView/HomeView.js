import React from 'react';
import { CreateTuit, Loader, Tuits, AvatarImage } from '../../components';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearTuits, findAllTuitsThunk } from '../../redux/tuitSlice';
const HomeView = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const user = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.tuits.loading);
  const dispatch = useDispatch();
  const tuits = useSelector((state) => state.tuits.list);
  useEffect(() => {
    dispatch(clearTuits());
    dispatch(findAllTuitsThunk());
  }, [dispatch]);
  return (
    isLoggedIn && (
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

        {/* {error && <ErrorBox message={error} />} */}
        <Loader loading={loading} message={'Loading Tuits'} />
        {tuits.length > 0 && <Tuits tuits={tuits} />}
      </div>
    )
  );
};
export default HomeView;

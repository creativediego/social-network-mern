import React from 'react';
import { NewTuit, Loader, Tuits, AvatarImage } from '../../components';
import { useAppSelector } from '../../redux/hooks';
import { authUserSelector } from '../../redux/userSlice';
import useAllTuits from '../../hooks/useAllTuits';
const HomeView = (): JSX.Element | null => {
  const { tuits, loading } = useAllTuits();
  const authUser = useAppSelector(authUserSelector);
  return (
    <div className='ttr-home'>
      <div className='border border-bottom-0'>
        <h5 className='fw-bold p-2'>Home</h5>
        {tuits && (
          <div className='d-flex'>
            <div className='p-2'>
              <AvatarImage profilePhoto={authUser.profilePhoto} size={70} />
            </div>
            <NewTuit />
          </div>
        )}
      </div>
      <Loader loading={loading} message={'Loading Tuits'} />
      {tuits.length > 0 && <Tuits tuits={tuits} />}
    </div>
  );
};
export default HomeView;

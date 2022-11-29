import React from 'react';
import { NewTuit, Loader, Tuits, AvatarImage } from '../../components';
import { useAppSelector } from '../../redux/hooks';
import { selectAuthUser } from '../../redux/userSlice';
import { useTuits } from '../../hooks/useTuits';

const HomePage = (): JSX.Element | null => {
  const { tuits, loading } = useTuits();
  const authUser = useAppSelector(selectAuthUser);
  return (
    <section className='ttr-home'>
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
      <Tuits tuits={tuits} />
    </section>
  );
};
export default HomePage;

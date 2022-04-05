import React from 'react';

import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UsersTuits from './UsersTuits';
import UsersLikes from './UsersLikes';
import UsersDislikes from './UsersDislikes';
import ProfileNav from './ProfileNav';
import service from '../../services/users-service';

const ProfileView = (userId) => {
  const user = await service.findUserById(userId);

  return (
    <div className='ttr-profile'>
      <div className='border border-bottom-0'>
        <h5 className='p-2 mb-0 pb-0 fw-bolder'>
          {user.name ? `${user.name}` : ''}
          <i className='fa fa-badge-check text-primary'></i>
        </h5>
        <span className='ps-2'>67.6K Tuits</span>
        <div className='mb-5 position-relative'>
          <img
            className='w-100'
            src='../images/nasa-profile-header.jpg'
            alt='profile header'
          />
          <div className='bottom-0 left-0 position-absolute'>
            <div className='position-relative'>
              <img
                className='position-relative img-fluid ttr-z-index-1 ttr-top-40px ttr-width-150px rounded-circle'
                alt='user profile'
                src={user.profilePhoto}
              />
            </div>
          </div>
        </div>

        <div className='p-2'>
          <h5 className='fw-bolder pb-0 mb-0'>
            {`${user.name}`}
            <i className='fa fa-badge-check text-primary'></i>
          </h5>
          <h6 className='pt-0'>{`@${user.username}`}</h6>
          <p className='pt-2'>{user.bio}</p>
          <p>
            {user.location
              ? <i className='far fa-location-dot me-2'></i> + user.location
              : ''}
            <i className='far fa-link ms-3 me-2'></i>
            {user.website ? (
              <a href={user.website} className='text-decoration-none'>
                {user.website}:
              </a>
            ) : (
              ''
            )}
            {/* <i className='far fa-balloon ms-3 me-2'></i>
            Born October 1, 1958
            <br /> */}
            <i className='far fa-calendar me-2'></i>
            {user.joinedDate}
          </p>
          <b>{user.followeeCount}</b> Following
          <b className='ms-4'>{user.followerCount}</b> Followers
          <ProfileNav />
        </div>
      </div>
      <Routes>
        <Route path='/tuits' element={<UsersTuits user={user}/>} />
        <Route path='/likes' element={<UsersLikes user={user} />} />
        <Route path='/dislikes' element={<UsersDislikes user={user} />} />

        {/* <Route path='/tuits-and-replies' element={<TuitsAndReplies />} /> */}
        {/* <Route path='/media' element={<Media />} />
        <Route path='/likes' element={<MyLikes />} /> */}
      </Routes>
    </div>
  );
};
export default ProfileView;

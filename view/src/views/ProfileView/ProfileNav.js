import React from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProfileNav = ({ userId }) => {
  const navItems = [
    {
      title: 'Tuits',
      link: `/${userId}/tuits`,
    },
    { title: 'Likes', link: `/${userId}/likes` },
    { title: 'Dislikes', link: `/${userId}/dislikes` },
    // { title: 'Tuits and Replies', link: `/${userId}/tuits-and-replies` },
    // { title: 'Media', link: `/${userId}/media` },
  ];
  return (
    <ul className='mt-4 nav nav-pills nav-fill'>
      {navItems.map((item) => (
        <li key={item.link} className='nav-item'>
          <NavLink
            to={item.link}
            // className={`nav-link ${
            //   location.pathname.indexOf(item.link) === 0 ? 'active' : ''
            // }`}
            className='nav-link'
          >
            {item.title}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default ProfileNav;

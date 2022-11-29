import React from 'react';
import { NavLink } from 'react-router-dom';

interface ProfileNavProps {
  username: string;
}
const ProfileNav = ({ username }: ProfileNavProps): JSX.Element => {
  const navItems = [
    {
      title: 'Tuits',
      link: `/${username}/tuits`,
    },
    { title: 'Likes', link: `/${username}/likes` },
    { title: 'Dislikes', link: `/${username}/dislikes` },
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

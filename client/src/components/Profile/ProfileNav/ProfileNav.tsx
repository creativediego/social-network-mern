import React from 'react';
import { NavLink } from 'react-router-dom';

interface ProfileNavProps {
  username: string;
}
const ProfileNav = ({ username }: ProfileNavProps): JSX.Element => {
  const navItems = [
    {
      title: 'Posts',
      link: `/${username}/posts`,
    },
    { title: 'Likes', link: `/${username}/likes` },
    { title: 'Dislikes', link: `/${username}/dislikes` },
    // { title: 'Posts and Replies', link: `/${userId}/posts-and-replies` },
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

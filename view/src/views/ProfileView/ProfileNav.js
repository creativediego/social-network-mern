import React from 'react';
import { NavLink } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const ProfileNav = () => {
  const { username } = useParams();
  const navItems = [
    {
      title: 'My Tuits',
      link: `/${username}/my-tuits`,
    },
    { title: 'Likes', link: `/${username}/my-likes` },
    { title: 'Dislikes', link: `/${username}/my-dislikes` },
    { title: 'Tuits and Replies', link: `/${username}/tuits-and-replies` },
    { title: 'Media', link: `/${username}/my-media` },
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

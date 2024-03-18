import React from 'react';
import { NavLink } from 'react-router-dom';
import { INavLink } from '../../Navigation/NavigationItem/NavigationItem';

/**
 * Props for the ProfileNav component.
 *
 * @interface ProfileNavProps
 * @property {string} username - The username for which the navigation links are displayed.
 */
interface ProfileNavProps {
  username: string;
}

/**
 * ProfileNav component displays navigation links for a user's profile page.
 *
 * @param {ProfileNavProps} props - The props for the component.
 * @returns {JSX.Element} - A JSX element representing the profile navigation.
 */
const ProfileNav = ({ username }: ProfileNavProps): JSX.Element => {
  const navItems: INavLink[] = [
    {
      label: 'Posts',
      path: `/${username}/posts`,
    },
    { label: 'Likes', path: `/${username}/likes` },
  ];

  return (
    <ul className='mt-4 nav nav-pills nav-fill'>
      {navItems.map((item) => (
        <li key={item.path} className='nav-item'>
          <NavLink to={item.path} className='nav-link'>
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default ProfileNav;

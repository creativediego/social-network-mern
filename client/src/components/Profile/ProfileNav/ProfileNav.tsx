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
 * `ProfileNav` is a component that displays navigation links for a user's profile page.
 * It creates an array of navigation items, each with a `label` and a `path`, and maps over them, rendering each as a list item with a `NavLink`.
 * The `NavLink` is styled with the 'nav-link' class and its `to` prop is set to the `path` of the navigation item.
 *
 * @param {ProfileNavProps} props - The properties passed to the component.
 * @param {string} props.username - The username for which the navigation links are displayed.
 *
 * @returns {JSX.Element} The `ProfileNav` component, which includes a list of navigation links for the user's profile page.
 *
 * @example
 * <ProfileNav username={username} />
 *
 * @see {@link NavLink} for the component that renders the navigation link.
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

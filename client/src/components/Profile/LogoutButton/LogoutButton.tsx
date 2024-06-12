import { useAuthUser } from '../../../hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';

/**
 * `LogoutButton` is a component that renders a logout button.
 * It uses the `useAuthUser` hook to get the `logout` function, and the `useNavigate` hook from `react-router-dom` to navigate to the home page after logout.
 * When the button is clicked, it calls the `logout` function and navigates to the home page.
 *
 * @returns {JSX.Element} The `LogoutButton` component, which includes a button that logs out the user and navigates to the home page.
 *
 * @example
 * <LogoutButton />
 *
 * @see {@link useAuthUser} for the hook that provides the `logout` function.
 * @see {@link useNavigate} for the hook that provides the function to navigate to different routes.
 */
const LogoutButton = (): JSX.Element => {
  const { logout } = useAuthUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
    navigate('/');
  };

  return (
    <button
      onClick={handleLogout}
      className='mt-2 me-2 btn btn-large btn-light border border-secondary fw-bolder rounded-pill fa-pull-right'
    >
      Logout
    </button>
  );
};

export default LogoutButton;

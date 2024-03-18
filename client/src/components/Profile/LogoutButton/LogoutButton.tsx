import React from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { useNavigate } from 'react-router-dom';

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

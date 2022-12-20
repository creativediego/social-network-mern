import React from 'react';
import { useAuthUser } from '../../../hooks/useAuthUser';

const LogoutButton = (): JSX.Element => {
  const { logout } = useAuthUser();

  return (
    <button
      onClick={() => logout()}
      className='mt-2 me-2 btn btn-large btn-light border border-secondary fw-bolder rounded-pill fa-pull-right'
    >
      Logout
    </button>
  );
};

export default LogoutButton;

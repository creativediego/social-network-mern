import React from 'react';
import Notification from './notification.js';
import { Routes, Route } from 'react-router-dom';
import { ProfileView } from '../../views/index.js';

/**
 * @File A container to display a list of notifications.
 */
const Notifications = ({ notifications }) => {
  return (
    <div>
      <ul className='ttr-tuits list-group'>
        {notifications &&
          notifications.map((notification) => {
            <Routes>
              <Route
                path={'/me'}
                element={<ProfileView user={notification.userActing} />}
              />
            </Routes>;
            return (
              <Notification key={notification.id} notification={notification} />
            );
          })}
      </ul>
    </div>
  );
};

export default Notifications;

import React, { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { GenericError } from './components';
import './styles.css';
import MainView from './pages/MainView/MainView';
import { LoginPage, LandingPage } from './pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';
import { clearUser, fetchProfileThunk } from './redux/userSlice';
import { onFirebaseSessionExpired } from './firebase/firebaseAuthService';

/**
 * Main entry point and control hub for the application.
 * Handles routing, user authentication, and profile management logic.
 *
 * @returns {JSX.Element} Root JSX element representing the entire application.
 */
function App(): JSX.Element {
  // Fetches user authentication and profile status
  const { profileComplete, isLoggedIn } = useAuthUser();
  const dispatch = useAppDispatch();

  // On component mount, fetch user profile information and check for session expiration
  useEffect(() => {
    onFirebaseSessionExpired(() => dispatch(clearUser()));
    dispatch(fetchProfileThunk());
  }, [dispatch]);

  return (
    <div>
      <HashRouter>
        <Routes>
          <Route
            path='/*'
            element={
              // Renders the MainView if the user is logged in and has a complete profile
              profileComplete && isLoggedIn ? (
                <MainView />
              ) : (
                // Displays LandingPage with LoginPage if the user is not logged in or the profile is incomplete
                <LandingPage>
                  <LoginPage />
                </LandingPage>
              )
            }
          ></Route>

          {/* Route for displaying error pages */}
          <Route
            path='/error'
            element={
              <LandingPage>
                <GenericError />
              </LandingPage>
            }
          ></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

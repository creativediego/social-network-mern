import React, { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { GenericError, VerifyEmail } from './components';
import './styles.css';
import MainView from './pages/MainView/MainView';
import { LoginPage, LandingPage } from './pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';
import { clearUser, fetchProfileThunk } from './redux/userSlice';
import { onFirebaseSessionChange } from './firebase/firebaseAuthService';
import { getLocalAuthToken } from './util/tokenManagement';
import {
  disconnectSocket,
  enableSocketListeners,
} from './services/socketService';
import { useUpdateProfile } from './forms/UpdateProfileForm/useUpdateProfile';
import { useSignUpForm } from './forms/SignupForm/useSignupForm';

/**
 * Main entry point and control hub for the application.
 * Handles routing, user authentication, and profile management logic.
 *
 * @returns {JSX.Element} Root JSX element representing the entire application.
 */
function App(): JSX.Element {
  // Fetches user authentication and profile status
  const { isVerified, completedSignup, isLoggedIn } = useSignUpForm();
  const dispatch = useAppDispatch();

  // On component mount, fetch user profile information and check for session expiration
  useEffect(() => {
    // Enable socket listeners if the user is logged in
    if (getLocalAuthToken()) {
      dispatch(fetchProfileThunk());
      enableSocketListeners();
    } else {
      disconnectSocket();
    }
    // Clear user profile information if the session expires
    const onSessionExpired = () => dispatch(clearUser());
    onFirebaseSessionChange(onSessionExpired);
  }, [dispatch]);

  return (
    <div>
      <HashRouter>
        <Routes>
          {completedSignup && <Route path='/*' element={<MainView />}></Route>}
          {!completedSignup && (
            <Route
              path='/*'
              element={
                <LandingPage>
                  {isLoggedIn && !isVerified ? <VerifyEmail /> : <LoginPage />}
                </LandingPage>
              }
            ></Route>
          )}

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

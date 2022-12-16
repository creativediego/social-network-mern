import React, { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { GenericError } from './components';
import './styles.css';
import TuiterView from './pages/TuiterView/TuiterView';
import { LoginPage, LandingPage } from './pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';
import { onFirebaseAuthStateChange } from './services/firebase-auth';
import { clearUser, fetchProfileThunk } from './redux/userSlice';
import { clearChat } from './redux/chatSlice';

function App() {
  const { profileComplete, isLoggedIn } = useAuthUser();
  const dispatch = useAppDispatch();
  useEffect(() => {
    const actionOnValidLogin = () => dispatch(fetchProfileThunk());
    const actionOnLoginExpiration = () => {
      dispatch(clearUser());
      dispatch(clearChat());
    };
    onFirebaseAuthStateChange(actionOnValidLogin, actionOnLoginExpiration);
  }, [dispatch]);
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route
            path='/*'
            element={
              profileComplete && isLoggedIn ? (
                <TuiterView />
              ) : (
                <LandingPage>
                  <LoginPage />
                </LandingPage>
              )
            }
          ></Route>
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

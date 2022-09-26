import React, { useEffect } from 'react';
import { GenericError } from './components';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import TuiterView from './pages/TuiterView/TuiterView';
import { LoginView, LandingView } from './pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Loader } from './components';
import { clearUser, fetchProfileThunk } from './redux/userSlice';
import { onFirebaseAuthStateChange } from './services/firebase-auth';

function App() {
  const profileComplete = useSelector((state) => state.user.profileComplete);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const actionOnValidLogin = () => dispatch(fetchProfileThunk());
    const actionOnLoginExpiration = () => dispatch(clearUser());
    onFirebaseAuthStateChange(actionOnValidLogin, actionOnLoginExpiration);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <HashRouter>
        <Routes>
          <Route
            path='/*'
            element={
              profileComplete ? (
                <TuiterView />
              ) : (
                <LandingView content={<LoginView />} />
              )
            }
          ></Route>
          <Route
            path='/error'
            element={
              <LandingView>
                <GenericError />
              </LandingView>
            }
          ></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;

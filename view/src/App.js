import React, { useEffect } from 'react';
import { GenericError } from './components';
import { useDispatch, useSelector } from 'react-redux';
import './styles.css';
import TuiterView from './views/TuiterView/TuiterView';
import { LoginView, LandingView } from './views';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { Loader } from './components';
import { clearUser, fetchProfileThunk } from './redux/userSlice';
import { onFirebaseAuthStateChange } from './services/firebase-auth';

function App() {
  const profileComplete = useSelector((state) => state.user.profileComplete);
  const authUser = useSelector((state) => state.user.data);
  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();

  useEffect(() => {
    const actionOnValidLogin = () => dispatch(fetchProfileThunk());
    const actionOnLoginExpiration = () => dispatch(clearUser());
    onFirebaseAuthStateChange(actionOnValidLogin, actionOnLoginExpiration);
  }, []);

  return (
    <div>
      {loading && !authUser ? (
        <div className='d-flex vh-100 justify-content-center align-items-center'>
          <Loader loading={loading} size='fs-1' />
          <i className='fa-brands fa-twitter text-primary fs-1 px-2'></i>
        </div>
      ) : (
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
              element={<LandingView content={<GenericError />} />}
            ></Route>
          </Routes>
        </HashRouter>
      )}
    </div>
  );
}

export default App;

import React, { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { GenericError } from './components';
import './styles.css';
import MainView from './pages/MainView/MainView';
import { LoginPage, LandingPage } from './pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';
import { fetchProfileThunk } from './redux/userSlice';
// Main app entry point
function App() {
  const { profileComplete, isLoggedIn } = useAuthUser();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchProfileThunk());
  }, [dispatch]);
  return (
    <div>
      <HashRouter>
        <Routes>
          <Route
            path='/*'
            element={
              profileComplete && isLoggedIn ? (
                <MainView />
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

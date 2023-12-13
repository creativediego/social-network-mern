import React from 'react';
import { GenericError } from './components';
import './styles.css';
import MainView from './pages/MainView/MainView';
import { LoginPage, LandingPage } from './pages';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { useAuthUser } from './hooks/useAuthUser';

// Main app entry point
function App() {
  const { profileComplete, isLoggedIn } = useAuthUser();
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

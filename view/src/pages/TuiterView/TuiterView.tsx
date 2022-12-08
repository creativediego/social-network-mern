import React from 'react';
import './TuiterView.css';
import { Routes, Route } from 'react-router-dom';
import { AlertBox, Navigation } from '../../components';
import {
  WhatsHappeningWidget,
  HomePage,
  BookmarksPage,
  ProfilePage,
  ExplorePage,
  NotificationsPage,
  MorePage,
  ListsPage,
  SearchPage,
} from '../index';
import MessagesView from '../MessagesPage/MessagesPage';
import { useAlert } from '../../hooks/useAlert';

/**
 * Main middle column view of the app where all pages are displayed.
 */
const TuiterView = (): JSX.Element => {
  const { error, success } = useAlert();
  return (
    <div className='container'>
      <div className='ttr-tuiter'>
        <div className='ttr-left-column'>
          <Navigation />
        </div>
        <div className='ttr-center-column'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/tuiter' element={<HomePage />} />
            <Route path='/:username/*' element={<ProfilePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/explore' element={<ExplorePage />} />
            <Route path='/notifications/*' element={<NotificationsPage />} />
            <Route path='/bookmarks' element={<BookmarksPage />} />
            <Route path='/lists' element={<ListsPage />} />
            <Route path='/more' element={<MorePage />} />
            <Route path='/messages/*' element={<MessagesView />} />
            <Route path='/search/*' element={<SearchPage />} />
          </Routes>
          {error && <AlertBox message={error.message} />}
          {success && <AlertBox message={success.message} variant='primary' />}
        </div>
        <div className='ttr-right-column'>
          <WhatsHappeningWidget />
        </div>
      </div>
    </div>
  );
};

export default TuiterView;

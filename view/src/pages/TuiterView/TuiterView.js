import React from 'react';
import './TuiterView.css';
import { Routes, Route } from 'react-router-dom';
import { AlertBox, Navigation } from '../../components';
import {
  WhatsHappeningView,
  HomeView,
  BookmarksView,
  ProfileView,
  ExploreView,
  NotificationsView,
  MoreView,
  ListsView,
  SearchView,
} from '../index';
import { useSelector } from 'react-redux';
import MessagesView from '../MessagesPage/MessagesPage';

function TuiterView() {
  const error = useSelector((state) => state.error.data);
  return (
    <div className='container'>
      <div className='ttr-tuiter'>
        <div className='ttr-left-column'>
          <Navigation />
        </div>
        <div className='ttr-center-column'>
          <Routes>
            <Route path='/' element={<HomeView />} />
            <Route path='/tuiter' element={<HomeView />} />
            <Route path='/:userId/*' element={<ProfileView />} />
            <Route path='/home' element={<HomeView />} />
            <Route path='/home/:uid' element={<HomeView />} />
            <Route path='/explore' element={<ExploreView />} />
            <Route path='/notifications/*' element={<NotificationsView />} />
            <Route path='/bookmarks' element={<BookmarksView />} />
            <Route path='/lists' element={<ListsView />} />
            <Route path='/more' element={<MoreView />} />
            <Route path='/messages/*' element={<MessagesView />} />
            <Route path='/search/*' element={<SearchView />} />
          </Routes>
          {error && <AlertBox message={error} />}
        </div>
        <div className='ttr-right-column'>
          <WhatsHappeningView />
        </div>
      </div>
    </div>
  );
}

export default TuiterView;

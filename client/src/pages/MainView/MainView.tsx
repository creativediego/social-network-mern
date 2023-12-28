import React from 'react';
import './MainView.css';
import { Routes, Route } from 'react-router-dom';
import { AlertBox, Navigation, PopupModal } from '../../components';
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
  MessagesPage,
} from '../index';
import { useAlert } from '../../hooks/useAlert';
import { useModal } from '../../hooks/useModal';

/**
 * Main middle column view of the app where all pages are displayed.
 */
const MainView = (): JSX.Element => {
  const { error, success } = useAlert();
  const { modal, handleCloseModal, confirmModal } = useModal();

  return (
    <div className='container'>
      <div className='ttr-poster'>
        <div className='ttr-left-column'>
          <Navigation />
        </div>
        <div className='ttr-center-column'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/:username/*' element={<ProfilePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/explore' element={<ExplorePage />} />
            <Route path='/notifications/*' element={<NotificationsPage />} />
            <Route path='/bookmarks' element={<BookmarksPage />} />
            <Route path='/lists' element={<ListsPage />} />
            <Route path='/more' element={<MorePage />} />
            <Route path='/messages/*' element={<MessagesPage />} />
            <Route path='/search/*' element={<SearchPage />} />
          </Routes>
          <PopupModal
            size='sm'
            title={modal.title}
            show={modal.isOpen}
            actionLabel={modal.actionLabel}
            withClose={true}
            closeModal={handleCloseModal}
            action={confirmModal}
          >
            <p>{modal.content}</p>
          </PopupModal>

          {error.message && <AlertBox message={error.message} />}
          {success && <AlertBox message={success.message} variant='primary' />}
        </div>
        <div className='ttr-right-column'>
          <WhatsHappeningWidget />
        </div>
      </div>
    </div>
  );
};

export default MainView;

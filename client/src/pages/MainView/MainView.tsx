import React from 'react';
import './MainView.css';
import { Routes, Route } from 'react-router-dom';
import { AlertBox, Navigation, PopupModal } from '../../components';
import {
  WhatsHappeningWidget,
  PostsPage,
  BookmarksPage,
  ProfilePage,
  ExplorePage,
  MorePage,
  ListsPage,
  SearchPage,
  MessagesPage,
} from '../index';
import { useAlert } from '../../hooks/useAlert';
import { useModal } from '../../hooks/useModal';

/**
 * Primary view component displaying the central layout of the application.
 * Renders various pages within the main columns and manages alerts and modals.
 *
 * @returns {JSX.Element} Root JSX element representing the main layout of the application.
 */
const MainView = (): JSX.Element => {
  // Retrieve alert messages for error and success that will be displayed in the AlertBox comp at bottom of this main view.
  const { error, success } = useAlert();

  // Global modal functionality - opening, closing, and confirming actions
  const { modal, handleCloseModal, confirmModal } = useModal();

  return (
    <div className='container'>
      <div className='ttr-poster'>
        {/* Left column containing navigation */}
        <div className='ttr-left-column'>
          <Navigation />
        </div>

        {/* Center column containing various pages */}
        <div className='ttr-center-column'>
          <Routes>
            {/* Routing setup for different paths */}
            <Route path='/' element={<PostsPage />} />
            <Route path='/:username/*' element={<ProfilePage />} />
            {/* <Route path='/home' element={<PostsPage />} /> */}
            <Route path='/explore' element={<ExplorePage />} />
            {/* <Route path='/notifications/*' element={<NotificationsPage />} /> */}
            <Route path='/bookmarks' element={<BookmarksPage />} />
            <Route path='/lists' element={<ListsPage />} />
            <Route path='/more' element={<MorePage />} />
            <Route path='/messages/*' element={<MessagesPage />} />
            <Route path='/search/*' element={<SearchPage />} />
          </Routes>

          {/* Global Popup modal for displaying conforming actions */}
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

          {/* Display error and success alerts if available */}
          {error.message && <AlertBox message={error.message} />}
          {success && <AlertBox message={success.message} variant='primary' />}
        </div>

        {/* Right column containing the 'What's Happening' widget */}
        <div className='ttr-right-column'>
          <WhatsHappeningWidget />
        </div>
      </div>
    </div>
  );
};

export default MainView;

// import React, { useEffect, useState } from 'react';

// import { Routes, Route, useParams } from 'react-router-dom';
// import LogoutButton from './LogoutButton';
// import ProfileNav from './ProfileNav';
// import {
//   Loader,
//   AvatarImage,
//   FollowButton,
//   PopupModal,
//   Tuits,
// } from '../../components';
// import UpdateProfileForm from '../../forms/UpdateProfileForm/UpdateProfileForm';
// import { useProfile } from './useProfile';
// import useToggleBoolean from '../../hooks/useToggleBoolean';

// const ProfileView = () => {
//   const { userId } = useParams();
//   const {
//     user,
//     isAuthUser,
//     loading,
//     myTuits,
//     likedTuits,
//     dislikedTuits,
//     handleUpdateUser,
//   } = useProfile(userId || '');
//   const [showEditProfile, setShowEditProfile] = useToggleBoolean(false);

//   const fakeFunc = () =>

//   return (
//     <div>
//       {loading && (
//         <div className='d-flex vh-100 justify-content-center align-items-center'>
//           <Loader loading={loading} size='fs-1' />
//         </div>
//       )}
//       {user && !loading && (
//         <div className='ttr-profile'>
//           <div className='border border-bottom-0'>
//             <h5 className='p-2 mb-0 pb-0 fw-bolder'>
//               {user.name || user.firstName}
//               <i className='fa fa-badge-check text-primary'></i>
//             </h5>
//             {/* <span className='ps-2'>{user.tuitCount} Tuits</span> */}
//             <div
//               className='mb-5 position-relative bg-dark'
//               style={{
//                 backgroundImage: `url('${user.headerImage})`,
//                 backgroundSize: 'cover',
//                 height: '200px',
//               }}
//             >
//               <div className='bottom-0 top-50 left-0  position-absolute rounded-circle'>
//                 <AvatarImage profilePhoto={user.profilePhoto} size={150} />
//               </div>
//               {isAuthUser && (
//                 <span>
//                   <LogoutButton />
//                   <button
//                     onClick={setShowEditProfile}
//                     className='mt-2 me-2 btn btn-large btn-light border border-secondary fw-bolder rounded-pill fa-pull-right'
//                   >
//                     Edit profile
//                   </button>
//                   <PopupModal
//                     title='Update Profile'
//                     show={showEditProfile}
//                     setShow={setShowEditProfile}
//                     size='lg'
//                   >
//                     <UpdateProfileForm />
//                   </PopupModal>
//                 </span>
//               )}
//             </div>

//             <div className='p-2'>
//               <h5 className='fw-bolder pb-0 mb-0'>
//                 {user.name || user.firstName}
//                 <i className='fa fa-badge-check text-primary'></i>
//               </h5>
//               <h6 className='pt-0'>{`@${user.username}`}</h6>
//               <p className='pt-2'>{user.bio}</p>
//               {/* <p>
//                 {user.location
//                   ? <i className='far fa-location-dot me-2'></i> + user.location
//                   : ''}
//                 <i className='far fa-link ms-3 me-2'></i>
//                 {user.website ? (
//                   <a href={user.website} className='text-decoration-none'>
//                     {user.website}:
//                   </a>
//                 ) : (
//                   ''
//                 )}

//                 <i className='far fa-calendar me-2'></i>
//                 {user.createdAt}
//               </p> */}
//               <b>{user ? user.followeeCount : 0}</b> Following
//               <b className='ms-4'>{user ? user.followerCount : 0}</b> Followers
//               {!isAuthUser && (
//                 <FollowButton userToFollow={user} setProfileUser={setUser} />
//               )}
//               <ProfileNav userId={user.id} />
//             </div>
//           </div>
//           <Routes>
//             <Route path='/tuits' element={<Tuits tuits={myTuits} />} />
//             <Route path='/likes' element={<Tuits tuits={likedTuits} />} />
//             <Route path='/dislikes' element={<Tuits tuits={dislikedTuits} />} />

//             {/* <Route path='/tuits-and-replies' element={<TuitsAndReplies />} /> */}
//             {/* <Route path='/media' element={<Media />} />
//         <Route path='/likes' element={<MyLikes />} /> */}
//           </Routes>
//         </div>
//       )}
//     </div>
//   );
// };
// export default ProfileView;

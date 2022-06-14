import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PopupModal } from '../../components';
import FormInput from '../FormInput/FormInput';
import { updateUserThunk } from '../../redux/userSlice';
import AvatarUpload from './AvatarUpload';
import { defaultProfileFields } from '../defaultProfileFields';

const UpdateProfileForm = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const error = useSelector((state) => state.error.data);

  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.data);
  const [profileValues, setProfileValues] = useState(authUser);

  const updateProfileValues = (e) => {
    setProfileValues({ ...profileValues, [e.target.name]: e.target.value });
  };
  const handleUpdateProfile = async () => {
    dispatch(updateUserThunk(profileValues));
  };

  useEffect(() => {
    setShowEditProfile(false);
    setProfileValues({ ...authUser });
  }, [authUser]);

  const profileInputs = () => (
    <div>
      <AvatarUpload
        profileValues={profileValues}
        setProfileValues={setProfileValues}
      />
      {defaultProfileFields.map((input) => (
        <FormInput
          key={input.id}
          {...input}
          value={profileValues[input.name]}
          onChange={updateProfileValues}
        />
      ))}
    </div>
  );
  const popupModalProps = {
    content: {
      size: 'md',
      title: 'Update profile',
      body: profileInputs(),
      submitLabel: 'Update',
    },
    handleSubmit: handleUpdateProfile,
    show: showEditProfile,
    setShow: setShowEditProfile,
    error: error,
  };

  return (
    <div>
      <button
        onClick={() => setShowEditProfile(true)}
        className='mt-2 me-2 btn btn-large btn-light border border-secondary fw-bolder rounded-pill fa-pull-right'
      >
        Edit profile
      </button>
      <PopupModal {...popupModalProps} />
    </div>
  );
};

export default UpdateProfileForm;

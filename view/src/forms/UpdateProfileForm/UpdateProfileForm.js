import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PopupModal } from '../../components';
import FormInput from '../FormInput/FormInput';
import { updateUserThunk } from '../../redux/userSlice';
import AvatarUpload from './AvatarUpload';

// upload photo -> update user in state -> make API call and update user again
const UpdateProfileForm = () => {
  const [showEditProfile, setShowEditProfile] = useState(false);

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
    console.log('Profile Values', profileValues);
  }, [profileValues]);
  const inputs = [
    {
      id: 1,
      name: 'name',
      type: 'text',
      placeholder: 'name',
      errorMessage:
        "name should be 3-15 characters and shouldn't include any special character!",
      label: 'name',
      pattern: "^[A-Za-z0-9 ,.'-]{3,15}$",
      required: true,
    },
    {
      id: 2,
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special character!",
      label: 'Username',
      pattern: '^[A-Za-z0-9]{3,16}$',
      required: true,
    },
    {
      id: 3,
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      errorMessage: 'It should be a valid email address!',
      label: 'Email',
      required: true,
    },
    {
      id: 4,
      name: 'birthday',
      type: 'date',
      placeholder: 'birthday',
      label: 'birthday',
    },
    {
      id: 5,
      name: 'bio',
      type: 'text',
      placeholder: 'bio',
      errorMessage: 'Bio should not exceed 280 characters.',
      label: 'bio',
      pattern: '/^.{0,280}$/',
      required: false,
    },
  ];
  const profileFields = () => (
    <div>
      <AvatarUpload
        profileValues={profileValues}
        setProfileValues={setProfileValues}
      />
      {inputs.map((input) => (
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
      body: profileFields(),
      submitLabel: 'Update',
    },
    handleSubmit: handleUpdateProfile,
    show: showEditProfile,
    setShow: setShowEditProfile,
  };

  return (
    <div>
      <button
        onClick={() => setShowEditProfile(!showEditProfile)}
        className='mt-2 me-2 btn btn-large btn-light border border-secondary fw-bolder rounded-pill fa-pull-right'
      >
        Edit profile
      </button>
      <PopupModal props={popupModalProps} />
    </div>
  );
};

export default UpdateProfileForm;

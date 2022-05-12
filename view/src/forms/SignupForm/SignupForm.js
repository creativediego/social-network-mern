import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerThunk, updateUserThunk } from '../../redux/userSlice';
import { PopupModal } from '../../components';
import SignupInputs from './SignupInputs';
import { Button } from 'react-bootstrap';
import AvatarUpload from '../UpdateProfileForm/AvatarUpload';

/**
 * Signup form displayed in a pop modal when the user clicks to register.
 * Validates user input. Checks redux state to see if user has completed profile, and if not, prompts the user to complete it. This applies for users who sign up with google, which after registered on the backend, need to fill out their username and date of birth.
 */
const SignupForm = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.user.data);
  const profileComplete = useSelector((state) => state.user.profileComplete);
  const [inputFields, setInputFields] = useState([]);
  const [inputFieldValues, setInputFieldValues] = useState({});
  const [showSignupModal, setShowSignupModal] = useState(false);

  const isFormValid = () => {
    console.log(inputFields);
    for (const input in inputFields) {
      const pattern = inputFields[input].pattern;
      if (pattern) {
        const regex = new RegExp(pattern);
        const inputValue = inputFieldValues[inputFields[input].name];
        if (!regex.test(inputValue)) return false;
      }
    }
    return true;
  };

  const handleSignup = () => {
    if (!isFormValid()) return;
    dispatch(registerThunk(inputFieldValues));
  };
  const handleCompleteSignup = () => {
    if (!isFormValid()) return;
    dispatch(updateUserThunk({ id: authUser.id, ...inputFieldValues }));
  };

  useEffect(() => {
    setInputFieldValues({ ...inputFieldValues, ...authUser });
    if (authUser && !profileComplete) {
      setShowSignupModal(true);
    }
    console.log('use effect input values', inputFieldValues);
  }, [authUser]);

  const signUpModalProps = {
    content: {
      size: 'md',
      title: 'Create account',
      body: (
        <SignupInputs
          inputValues={inputFieldValues}
          setInputValues={setInputFieldValues}
          setInputFields={setInputFields}
        />
      ),
      submitLabel: 'Submit',
      modalOpenerLabel: 'Sign up',
    },
    handleSubmit: handleSignup,
    show: showSignupModal,
    setShow: setShowSignupModal,
  };

  const completeSignupModalProps = {
    content: {
      size: 'md',
      title: 'Complete signup',
      body: (
        <div>
          <AvatarUpload
            profileValues={inputFieldValues}
            setProfileValues={setInputFieldValues}
          />
          <SignupInputs
            inputValues={inputFieldValues}
            setInputValues={setInputFieldValues}
            setInputFields={setInputFields}
          />
        </div>
      ),
      submitLabel: 'Submit',
    },
    handleSubmit: handleCompleteSignup,
    show: showSignupModal,
    setShow: setShowSignupModal,
  };

  return (
    <div>
      {authUser && !profileComplete ? (
        <PopupModal props={completeSignupModalProps} />
      ) : (
        <div>
          <Button
            className='rounded-pill'
            variant='primary'
            onClick={() => setShowSignupModal(true)}
          >
            Sign up
          </Button>
          <PopupModal props={signUpModalProps} />
        </div>
      )}
    </div>
  );
};

export default SignupForm;

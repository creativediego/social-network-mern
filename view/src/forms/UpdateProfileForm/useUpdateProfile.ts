import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { InputFieldI } from '../../interfaces/InputFieldI';
import { profileFields } from '../shared/profileFields';
import { IUser } from '../../interfaces/IUser';
import { updateUserThunk } from '../../redux/userSlice';
import { firebaseUploadProfileImage } from '../../services/storage-service';
import { ImageTypes } from '../../interfaces/ImageTypes';
import { setGlobalError } from '../../redux/alertSlice';

/**
 * Custom hook that Mmnages the state of the update/edit profile form, including form fields, image uploads, and submitting the form.
 */
const useUpdateProfile = () => {
  const mounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.user.data);
  const [tempUser, setTempUser] = useState<IUser>({
    ...authUser,
  });
  const [inputFields, setInputFields] = useState<InputFieldI>({
    ...profileFields,
  });

  const setInputField = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const element: HTMLInputElement = e.currentTarget;
    setInputFields((prevState) => ({
      ...prevState,
      [element.name]: {
        ...prevState[element.name],
        value: element.value,
      },
    }));
    if (mounted) {
      setTempUser((prevState) => {
        return { ...prevState, [element.name]: element.value };
      });
    }
  }, []);

  const uploadProfileImage = useCallback(
    async (file: File | null, imageType: ImageTypes) => {
      if (!file) return;
      setLoading(true);
      try {
        const imageURL = await firebaseUploadProfileImage(file, imageType);
        if (mounted.current) {
          setTempUser((prevState) => {
            return { ...prevState, [imageType]: imageURL };
          });
          setLoading(false);
        }
      } catch (err) {
        const message =
          'Sorry, we ran into an error uploading your profile image. Try again later.';
        dispatch(setGlobalError({ code: 500, message }));
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // For each auth user value, find an input field that matches the key, and change the field's value with the auth user value.
  const mapExistingFieldValues = () => {
    for (const [key, val] of Object.entries(authUser)) {
      if (key in inputFields) {
        setInputFields((prevState) => ({
          ...prevState,
          [key]: {
            ...prevState[key],
            value: val,
          },
        }));
      }
    }
  };

  // Change confirm password field pattern to match current value of password field.
  const updateConfirmPasswordPattern = () => {
    setInputFields((prevState) => ({
      ...prevState,
      password: {
        ...profileFields['password'],
        required: false,
      },
      confirmPassword: {
        id: '9999',
        name: 'confirmPassword',
        type: 'password',
        placeholder: 'confirm password',
        errorMessage: "Passwords don't match!",
        label: 'confirm password',
        required: false,
        pattern: inputFields.password.value,
        value: '',
      },
    }));
  };

  const isFormValid = (): boolean => {
    for (const field of Object.values(inputFields)) {
      const regexPattern = new RegExp(field.pattern);
      if (field.required && !regexPattern.test(field.value)) {
        dispatch(setGlobalError({ message: field.errorMessage }));
        return false;
      }
    }
    return true;
  };

  const submitForm = async () => {
    if (!isFormValid()) {
      return;
    }
    setLoading(true);
    await dispatch(updateUserThunk(tempUser));
    setLoading(false);
  };

  // Sets up component initial field values and cleanup subscription.
  useEffect(() => {
    mounted.current = true;
    if (mounted.current) {
      mapExistingFieldValues();
      updateConfirmPasswordPattern();
    }
    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    inputFields,
    setInputField,
    user: tempUser,
    setUser: setTempUser,
    loading,
    uploadProfileImage,
    submitForm,
  };
};

export default useUpdateProfile;

import { useCallback, useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { FormFieldI } from '../../interfaces/FormFieldI';
import { profileFieldsStore } from '../shared/profileFieldsStore';
import { IUser } from '../../interfaces/IUser';
import { updateUserThunk } from '../../redux/userSlice';
import { firebaseUploadProfileImage } from '../../services/storage-service';
import { ImageTypes } from '../../interfaces/ImageTypes';
import { setGlobalError } from '../../redux/alertSlice';
import { FriendlyError } from '../../interfaces/IError';
import { auth } from '../../services/firebase-config';

const useUpdateProfile = () => {
  const mounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.user.data);
  const [tempUser, setTempUser] = useState<IUser>({ ...authUser });
  const [inputFields, setInputFields] = useState<FormFieldI>({
    name: { ...profileFieldsStore['name'] },
    username: { ...profileFieldsStore['username'] },
    bio: { ...profileFieldsStore['bio'] },
    email: { ...profileFieldsStore['email'] },
    password: { ...profileFieldsStore['password'] },
    confirmPassword: { ...profileFieldsStore['confirmPassword'] },
    profilePhoto: { ...profileFieldsStore['profilePhoto'] },
    headerImage: { ...profileFieldsStore['headerImage'] },
  });

  const setInputField = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setInputFields((prevState) => ({
      ...prevState,
      [name]: { ...prevState[name], value },
    }));
    if (mounted.current) {
      setTempUser((prevState) => ({ ...prevState, [name]: value }));
    }
  }, []);

  const uploadProfileImage = useCallback(
    async (file: File | null, imageType: ImageTypes) => {
      if (!file) return;
      setLoading(true);
      try {
        const imageURL = await firebaseUploadProfileImage(file, imageType);
        if (mounted.current) {
          setTempUser((prevState) => ({ ...prevState, [imageType]: imageURL }));
          setLoading(false);
        }
      } catch (err) {
        const message =
          'Sorry, we ran into an error uploading your profile image. Try again later.';
        dispatch(setGlobalError(new FriendlyError(message, 500)));
      }
    },
    []
  );

  const mapInitialFields = () => {
    let updatedInputFields: FormFieldI = { ...inputFields };
    // If user is not registered with a provider, update confirmPassword pattern
    if (!authUser.registeredWithProvider) {
      updatedInputFields = {
        ...updatedInputFields,
        confirmPassword: {
          ...updatedInputFields['confirmPassword'],
          pattern: inputFields.password.value,
        },
      };
    } else {
      // else set email, password, and confirmPassword to readOnly
      updatedInputFields = {
        ...updatedInputFields,
        email: { ...updatedInputFields['email'], readOnly: true },
        password: { ...updatedInputFields['password'], readOnly: true },
        confirmPassword: {
          ...updatedInputFields['confirmPassword'],
          readOnly: true,
        },
      };
    }
    // Update input fields with user data
    for (const [key, value] of Object.entries(authUser)) {
      if (key in profileFieldsStore) {
        updatedInputFields[key] = { ...updatedInputFields[key], value };
      }
    }

    setInputFields(updatedInputFields);
  };

  // const updateConfirmPasswordPattern = () => {
  //   setInputFields((prevState) => ({
  //     ...prevState,
  //     password: { ...profileFieldsStore['password'], required: false },
  //     confirmPassword: {
  //       id: '9999',
  //       name: 'confirmPassword',
  //       type: 'password',
  //       placeholder: 'confirm password',
  //       errorMessage: "Passwords don't match!",
  //       label: 'confirm password',
  //       required: false,
  //       pattern: inputFields.password.value,
  //       value: '',
  //     },
  //   }));
  // };

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

  useEffect(() => {
    mounted.current = true;
    if (mounted.current) {
      mapInitialFields();
    }
    return () => {
      mounted.current = false;
    };
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

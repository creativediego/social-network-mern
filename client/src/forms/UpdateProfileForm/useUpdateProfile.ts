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

const useUpdateProfile = (fields: string[]) => {
  const mounted = useRef(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.user.data);
  const [tempUser, setTempUser] = useState<IUser>({ ...authUser });
  const [inputFields, setInputFields] = useState<FormFieldI>({});

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
    const updatedInputFields: FormFieldI = { ...inputFields };
    for (const [key, value] of Object.entries(authUser)) {
      if (key in profileFieldsStore) {
        if (
          authUser.registeredWithProvider &&
          (key === 'email' || key === 'password')
        ) {
          delete updatedInputFields[key];
          continue;
        } else if (key === 'password') {
          updateConfirmPasswordPattern();
        }
        updatedInputFields[key] = { ...profileFieldsStore[key], value };
      }
    }
    if (authUser.registeredWithProvider) {
      delete updatedInputFields['email'];
      delete updatedInputFields['password'];
    }
    setInputFields(updatedInputFields);
  };

  const updateConfirmPasswordPattern = () => {
    setInputFields((prevState) => ({
      ...prevState,
      password: { ...profileFieldsStore['password'], required: false },
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
        dispatch(setGlobalError(new FriendlyError(field.errorMessage)));
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

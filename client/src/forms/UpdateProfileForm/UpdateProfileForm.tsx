import React from 'react';
import FormInput from '../FormInput/FormInput';
import AvatarUpload from './AvatarUpload';
import { ActionButton, Loader } from '../../components';
import useUpdateProfile from './useUpdateProfile';
import HeaderImageUpload from './HeaderImageUpload';

/**
 * Displays the form to update user's profile, including fields and images. Uses custom hook to manage state and submit form.
 */
interface UpdateProfileFormProps {
  showOptional: boolean;
  submitCallBack?: () => void;
}
const UpdateProfileForm = ({
  showOptional,
  submitCallBack,
}: UpdateProfileFormProps): JSX.Element => {
  const {
    loading,
    inputFields,
    setInputField,
    user,
    uploadProfileImage,
    submitForm,
  } = useUpdateProfile();
  return (
    <div>
      <div className='mb-5 position-relative bg-white'>
        {loading ? (
          <div className='position-absolute top-30 bottom-50 start-50 end-50'>
            <Loader loading={loading} size='fs-3' />
          </div>
        ) : (
          <div>
            <HeaderImageUpload
              imageURL={user.headerImage}
              uploadImage={uploadProfileImage}
            />
            <AvatarUpload
              imageURL={user.profilePhoto}
              uploadImage={uploadProfileImage}
            />
          </div>
        )}
      </div>
      {Object.values(inputFields).map((input) =>
        input.name !== 'headerImage' &&
        input.name !== 'profilePhoto' &&
        (showOptional || (!showOptional && input.required)) ? (
          <FormInput
            key={input.id}
            {...input}
            value={input.value}
            onChange={setInputField}
          />
        ) : null
      )}
      <ActionButton
        submitAction={() => {
          submitForm();
          if (submitCallBack) {
            submitCallBack();
          }
        }}
        position={'right'}
        loading={loading}
      />
    </div>
  );
};

export default UpdateProfileForm;
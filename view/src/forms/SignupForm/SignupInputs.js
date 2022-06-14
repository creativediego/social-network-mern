import { React, useEffect } from 'react';
import { FormInput } from '..';
import { useSelector } from 'react-redux';
import { defaultProfileFields } from '../defaultProfileFields';

const SignupInputs = ({ inputValues, setInputValues, setInputFields }) => {
  const user = useSelector((state) => state.user.data);
  const profileComplete = useSelector((state) => state.user.profileComplete);
  const setInputFieldsInTheParent = setInputFields;
  const inputs = [
    ...defaultProfileFields,
    {
      id: 4,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      errorMessage:
        'Password should be 8-20 characters and include at least 1 letter, 1 number and 1 special character!',
      label: 'Password',
      pattern: `^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,20}$`,
      required: true,
    },
    {
      id: 5,
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      errorMessage: "Passwords don't match!",
      label: 'Confirm Password',
      pattern: inputValues.password,
      required: true,
    },
  ];

  const updateInputValue = (e) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setInputFieldsInTheParent(mapRelevantInputs());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const mapRelevantInputs = () => {
    let mappedFields = [];
    if (!user) {
      mappedFields = inputs.filter(
        (input) =>
          input.name !== 'bio' &&
          input.name !== 'username' &&
          input.name !== 'birthday' &&
          input.name !== 'name'
      );
    } else if (user && !profileComplete) {
      mappedFields = inputs.filter(
        (input) => !user[input.name] && input.type !== 'password'
      );
    }
    return mappedFields;
  };

  return mapRelevantInputs().map((input) => (
    <FormInput
      key={input.id}
      {...input}
      value={inputValues[input.name] || ''}
      onChange={updateInputValue}
    />
  ));
};

export default SignupInputs;

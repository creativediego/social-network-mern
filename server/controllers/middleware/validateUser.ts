import { param, body } from 'express-validator';
import { UserErrorMessages as UserValidationMessages } from '../../models/users/UserErrorMessages';
import { AccountType } from '../../models/users/AccoutType';

export const validateProfile = [
  param('userId').trim().isString(),
  param('uid').trim().isString(),
  body('email')
    .trim()
    .isEmail()
    .withMessage(UserValidationMessages.INVALID_EMAIL)
    .not()
    .isEmpty()
    .withMessage(UserValidationMessages.INVALID_EMAIL),
  body('username')
    .trim()
    .not()
    .isEmpty()
    .withMessage(UserValidationMessages.EMPTY_USERNAME)
    .isLength({ min: 3, max: 15 })
    .withMessage(UserValidationMessages.INVALID_USERNAME),
  body('bio')
    .trim()
    .isLength({ min: 0, max: 160 })
    .withMessage(UserValidationMessages.INVALID_BIO),
  // body('birthday').trim().isDate(),
  // body('accountType')
  //   .trim()
  //   .toUpperCase()
  //   .isIn(Object.values(AccountType))
  //   .withMessage('Invalid account type.'),
  // body('headerImage')
  //   .exists()
  //   .trim()
  //   .matches(/\.(jpe?g|png)$/i)
  //   .withMessage('Profile header image invalid.'),
  // body('profilePhoto')
  //   .exists()
  //   .trim()
  //   .matches(/\.(jpe?g|png)$/i)
  //   .withMessage('Profile photo invalid.'),
];

export const validatePassword = [
  body('password')
    .trim()
    .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/)
    .withMessage(UserValidationMessages.INVALID_PASSWORD),
];

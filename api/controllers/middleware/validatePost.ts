import { param, body, validationResult } from 'express-validator';

export const validatePost = [
  body('post')
    .exists()
    .trim()
    .isString()
    .isLength({ min: 0, max: 260 })
    .withMessage('Posts must be between 2 and 280 characters'),

  param('userId').exists().withMessage('User id must be provided.').trim(),
];

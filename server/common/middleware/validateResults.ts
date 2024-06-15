import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { Code } from '../enums/StatusCode';

/**
 * Validates the results of an Express request and sends an error response if there are any validation errors.
 */
export const validateResults = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const errorContent = {
    message: errors.array(),
    code: Code.badRequest,
  };
  res.status(Code.badRequest).json({ error: errorContent });
};

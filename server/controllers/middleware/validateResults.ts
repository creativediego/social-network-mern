import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { StatusCode } from '../shared/HttpStatusCode';
import IError from '../../errors/IError';
export const validateResults = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const result = validationResult(req).array();
  if (!result.length) {
    return next();
  }
  // const errors: {}[] = [];
  // result.map((error) => {
  //   errors.push({ message: error.msg, field: error.param });
  // }),
  const errorContent = {
    message: result[0].msg,
    code: StatusCode.badRequest,
  };
  console.log(result);
  res.status(StatusCode.badRequest).json({ error: errorContent });
};

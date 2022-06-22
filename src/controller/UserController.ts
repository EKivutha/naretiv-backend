import { NextFunction, Request, Response } from 'express';
import { findUsers } from '../services/user';

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    res.status(200).status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err: any) {
    next(err);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
      const users = await findUsers();

      res.status(200).json({
          status: 'success',
          data: {
              users
          }
      })
  } catch (err: any) {
      next(err);
  }
}


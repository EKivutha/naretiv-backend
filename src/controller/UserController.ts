import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/user';
import { UpdateUserInput } from '../schemas/user';
import { findUserById, findUsers } from '../services/user';
import AppError from '../utils/appError';

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

export const updateUserHandler = async (
  req: Request<UpdateUserInput['params'], {}, UpdateUserInput['body']>,
  res: Response,
  next: NextFunction
) => {
  try {
     
      const User = await findUserById(res.locals.user.id as string);

      if (!User) {
          return next(new AppError(404, 'user with that ID not found'));
      }

      Object.assign(User, req.body);

      const updatedUser = await User.save();

      res.status(200).json({
          status: 'success',
          data: {
              User: updatedUser,
          },
      });
  } catch (err: any) {
      next(err);
  }
};

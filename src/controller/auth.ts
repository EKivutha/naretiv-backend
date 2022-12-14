import { CookieOptions, NextFunction, Request, Response } from 'express';
import config from 'config';
require('dotenv').config()
import {
  createUser,
  findUser,
  findUserByEmail,
  findUserById,
  signTokens,
} from '../services/user';
import AppError from '../utils/appError';
import redisClient from '../utils/connectRedis';
import { signJwt, verifyJwt } from '../utils/jwt';
import { CreateUserInput, LoginUserInput, VerifyEmailInput } from '../schemas/user';
import { User } from '../entity/user';
import Email from '../utils/email';
import crypto from 'crypto';
import { nextTick } from 'process';


export const excludedFields = ['password'];

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
};

if (process.env.NODE_ENV === 'production') cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('accessTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('accessTokenExpiresIn') * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>('refreshTokenExpiresIn') * 60 * 1000
  ),
  maxAge: config.get<number>('refreshTokenExpiresIn') * 60 * 1000,
};

// 👈 Cookie Options Here

export const registerUserHandler = async (
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, password, email, role, age } = req.body;

    const newUser = await createUser({
      name,
      email: email.toLowerCase(),
      password,
      role,
      age,
      passwordConfirm: '',
    });

    const { hashVerificationCode, verificationCode } =
      User.createVerificationCode();
    newUser.verificationCode = hashVerificationCode;
    await newUser.save();

    // Send Verification Email
    const redirectUrl = `${config.get<string>(
      'origin'
    )}/api/auth/verifyemail/${verificationCode}`;

    try {
      await new Email(newUser, redirectUrl).sendVerificationCode();

      res.status(201).json({
        status: 'success',
        message:
          `An email with a verification code has been sent to ${email}`,
      });
    } catch (error) {
      console.log('email error',error)
      newUser.verificationCode = null;
      await newUser.save();

      return res.status(500).json({
        status: 'error',
        message: `There was an error sending email to ${email}, please try again`,
      });
    }
  } catch (err: any) {
    if (err.code === '23505') {
      return res.status(409).json({
        status: 'fail',
        message: 'User with that email already exist',
      });
    }
    next(err);
  }
};

export const loginUserHandler = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail({ email });

    // Check if user exists and password is valid
    if (!user || !(await User.comparePasswords(password, user.password))) {
      return next(new AppError(400, 'Invalid email or password'));
    }

    //  Check if the user is verified
    if (!user.verified) {
      return next(new AppError(400, 'You are not verified'));
    }

    //check if password is valid
    if(!(await User.comparePasswords(password, user.password))){
      return next(new AppError (400, 'Invalid email or password'));
    }

    //  Sign Access and Refresh Tokens
    const { access_token, refresh_token } = await signTokens(user);
    //  Add Cookies
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('refresh_token', refresh_token, refreshTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    //  Send response
    res.status(200).json({
      status: 'success',
      access_token,
      user,
    });
  } catch (err: any) {
    next(err);
  }
};

export const refreshAccessTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = 'Could not refresh access token';

    if (!refresh_token) {
      return next(new AppError(403, message));
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refresh_token,
      'refreshTokenPublicKey'
    );

    if (!decoded) {
      return next(new AppError(403, message));
    }

    // Check if user has a valid session
    const session = await redisClient.get(decoded.sub);

    if (!session) {
      return next(new AppError(403, message));
    }

    // Check if user still exist
    const user = await findUserById(JSON.parse(session).id);

    if (!user) {
      return next(new AppError(403, message));
    }

    // Sign new access token
    const access_token = signJwt({ sub: user.id }, 'accessTokenPrivateKey', {
      expiresIn: `${config.get<number>('accessTokenExpiresIn')}m`,
    });

    // 4. Add Cookies
    res.cookie('access_token', access_token, accessTokenCookieOptions);
    res.cookie('logged_in', true, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    // 5. Send response
    res.status(200).json({
      status: 'success',
      access_token,
    });
  } catch (err: any) {
    next(err);
  }
};

export const verifyEmailHandler = async (
  req: Request<VerifyEmailInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    const verificationCode = crypto
      .createHash('sha256')
      .update(req.params.verificationCode)
      .digest('hex')

      const user = await findUser({verificationCode})

      if (!user){
        return next(new AppError(401, 'Could not verify email'));
      }

      user.verified = true;
      user.verificationCode = null;
      await user.save();

      res.status(200).json({
        status: 'success',
        message: 'Email verified successfully'
      })

  }
  catch (error: any) {
    next(error)
  }
}

const logout = (res: Response) => {
  res.cookie('access_token', '', { maxAge: -1 });
  res.cookie('refresh_token', '', { maxAge: -1 });
  res.cookie('logged_in', '', { maxAge: -1 });
};

export const logoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    await redisClient.del(user.id);
    logout(res);

    res.status(200).json({
      status: 'success',
    });
  } catch (err: any) {
    next(err);
  }
};
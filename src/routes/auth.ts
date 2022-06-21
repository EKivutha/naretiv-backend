import express from 'express';
import { registerUserHandler, loginUserHandler, logoutHandler, refreshAccessTokenHandler, verifyEmailHandler } from '../controller/auth';
import { deserializeUser } from '../middleware/deserializeUser';
import { requireUser } from '../middleware/requireUser';
import { validate } from '../middleware/validate';
import { createUserSchema, loginUserSchema, verifyEmailSchema } from '../schemas/user';

const router = express.Router();

// Register user
router.post('/register/', validate(createUserSchema), registerUserHandler);

// Login user
router.post('/login', validate(loginUserSchema), loginUserHandler);

// Logout user
router.get('/logout', deserializeUser, requireUser, logoutHandler);

// Refresh access token
router.get(
    '/refresh', 
    refreshAccessTokenHandler);
//Verify email address
router.get(
    '/verifyemail/:verificationCode',
    validate(verifyEmailSchema),
    verifyEmailHandler
  );

export default router;


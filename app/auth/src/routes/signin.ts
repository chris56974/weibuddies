import { Router } from 'express';
import { validateRequest } from '@weibuddies/common';
import { body } from 'express-validator';
import { signInUser } from '../controller/userController';

const router = Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  signInUser,
);

export { router as signInRouter };

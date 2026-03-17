import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/register',
  validateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.get('/', auth(USER_ROLE.admin), UserControllers.getAllUsers);

router.get('/:userId', UserControllers.getSingleUser);

router.get(
  '/current/me',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getMe,
);

router.patch(
  '/:userId',
  auth(USER_ROLE.user, USER_ROLE.admin),
  validateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser,
);

export const UserRoutes = router;

import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { CouponControllers } from './coupon.controller';
import { CouponValidations } from './coupon.validation';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(CouponValidations.createCouponValidationSchema),
  CouponControllers.createCoupon,
);

router.get('/', auth(USER_ROLE.admin), CouponControllers.getAllCoupons);
router.get('/:id', CouponControllers.getSingleCoupon);

router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CouponValidations.updateCouponValidationSchema),
  CouponControllers.updateCoupon,
);

router.delete('/:id', auth(USER_ROLE.admin), CouponControllers.deleteCoupon);

export const CouponRoutes = router;

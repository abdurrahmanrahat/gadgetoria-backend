import express from 'express';
import { auth } from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { OrderControllers } from './order.controller';
import { OrderValidations } from './order.validation';

const router = express.Router();

router.post(
  '/create-order',
  validateRequest(OrderValidations.createOrderValidationSchema),
  OrderControllers.createOrder,
);

router.get('/', auth(USER_ROLE.admin), OrderControllers.getAllOrders);

router.get('/:orderId', OrderControllers.getSingleOrder);
router.post('/tracking', OrderControllers.trackingOrder);

router.patch(
  '/:orderId',
  auth(USER_ROLE.admin),
  validateRequest(OrderValidations.updateOrderValidationSchema),
  OrderControllers.updateOrder,
);

router.delete('/:orderId', auth(USER_ROLE.admin), OrderControllers.deleteOrder);

export const OrderRoutes = router;

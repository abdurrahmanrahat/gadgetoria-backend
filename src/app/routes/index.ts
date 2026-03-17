import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CategoryRoutes } from '../modules/category/category.route';
import { CouponRoutes } from '../modules/coupon/coupon.route';
import { OrderRoutes } from '../modules/order/order.route';
import { ProductRoutes } from '../modules/product/product.route';
import { UploadRoutes } from '../modules/upload/upload.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

// router.use('/users', UserRoutes);

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/upload',
    route: UploadRoutes,
  },
  {
    path: '/categories',
    route: CategoryRoutes,
  },
  {
    path: '/products',
    route: ProductRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/coupons',
    route: CouponRoutes,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;

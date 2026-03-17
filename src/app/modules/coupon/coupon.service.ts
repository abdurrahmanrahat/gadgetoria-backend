import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { couponSearchableFields } from './coupon.constant';
import { TCoupon } from './coupon.interface';
import { Coupon } from './coupon.model';

// create
const createCouponIntoDB = async (payload: TCoupon) => {
  const existing = await Coupon.findOne({
    code: payload.code,
    isDeleted: false,
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Coupon already exists');
  }

  return await Coupon.create(payload);
};

// get all
const getAllCouponsFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = Coupon.find({ isDeleted: false }).lean();

  const couponQuery = new QueryBuilder(baseQuery, query)
    .search(couponSearchableFields)
    .filter()
    .paginate()
    .sort();

  const countQuery = new QueryBuilder(baseQuery, query)
    .search(couponSearchableFields)
    .filter();

  const [data, totalCount] = await Promise.all([
    couponQuery.modelQuery,
    countQuery.modelQuery.countDocuments(),
  ]);

  return { data, totalCount };
};

// get single
const getSingleCouponFromDB = async (id: string) => {
  const coupon = await Coupon.findOne({ _id: id, isDeleted: false });

  if (!coupon) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Coupon with id '${id}' not found`,
    );
  }

  return coupon;
};

// update
const updateCouponIntoDB = async (id: string, payload: Partial<TCoupon>) => {
  const coupon = await Coupon.findOne({ _id: id, isDeleted: false });

  if (!coupon) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Coupon with id '${id}' not found`,
    );
  }

  return await Coupon.findByIdAndUpdate(id, payload, { new: true });
};

// soft delete
const deleteCouponFromDB = async (id: string) => {
  const coupon = await Coupon.findOne({ _id: id, isDeleted: false });

  if (!coupon) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Coupon with id '${id}' not found`,
    );
  }

  return await Coupon.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
};

export const CouponServices = {
  createCouponIntoDB,
  getAllCouponsFromDB,
  getSingleCouponFromDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
};

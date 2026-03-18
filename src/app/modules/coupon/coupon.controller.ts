import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { CouponServices } from './coupon.service';

// create
const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await CouponServices.createCouponIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Coupon created successfully',
    data: result,
  });
});

// get all
const getAllCoupons = catchAsync(async (req, res) => {
  const result = await CouponServices.getAllCouponsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupons retrieved successfully',
    data: result,
  });
});

// get single
const getSingleCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code } = req.params;

  const result = await CouponServices.getSingleCouponFromDB(code);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon retrieved successfully',
    data: result,
  });
});

// update
const updateCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CouponServices.updateCouponIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon updated successfully',
    data: result,
  });
});

// delete (soft)
const deleteCoupon = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await CouponServices.deleteCouponFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Coupon deleted successfully',
    data: result,
  });
});

export const CouponControllers = {
  createCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
  deleteCoupon,
};

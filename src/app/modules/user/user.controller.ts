import { Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UserServices } from './user.service';

const createUser = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;

  const result = await UserServices.createUserIntoDB(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User register successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getSingleUserFromDB(req.params.userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    throw new AppError(httpStatus.NOT_FOUND, 'Token not found!');
  }

  const result = await UserServices.getLoggedInUserFromDB(accessToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User found successfully',
    data: { user: result },
  });
});

const updateUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;

  const result = await UserServices.updateUserIntoDB(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
  getSingleUser,
  getMe,
  updateUser,
};

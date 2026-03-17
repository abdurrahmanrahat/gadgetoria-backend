import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

// post
const createUserIntoDB = async (user: TUser) => {
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const result = await User.create(user);
  return result;
};

// get
const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const baseQuery = User.find({ isDeleted: false }).select('-password').lean();

  const userQuery = new QueryBuilder(baseQuery, query)
    .search(userSearchableFields) // adjust searchable fields if needed
    .filter()
    .paginate()
    .sort();

  const countQuery = new QueryBuilder(baseQuery, query)
    .search(userSearchableFields)
    .filter();

  const [data, totalCount] = await Promise.all([
    userQuery.modelQuery,
    countQuery.modelQuery.countDocuments(),
  ]);

  return { data, totalCount };
};

const getSingleUserFromDB = async (userId: string) => {
  if (!userId) {
    throw new AppError(Number(httpStatus[400]), 'Missing user id');
  }

  const result = await User.findOne({ _id: userId, isDeleted: false }).select(
    '-password',
  );

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `User with the id '${userId}' is not found!`,
    );
  }

  return result;
};

// get logged in user
const getLoggedInUserFromDB = async (accessToken: string) => {
  try {
    const verifiedToken = jwt.verify(
      accessToken,
      config.jwt_access_secret as string,
    );

    const { email } = verifiedToken as JwtPayload;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return user;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
  }
};

// update user
const updateUserIntoDB = async (
  userId: string,
  updatedData: Partial<TUser>,
) => {
  const result = await User.findByIdAndUpdate(userId, updatedData, {
    new: true,
  });

  return result;
};

export const UserServices = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  getLoggedInUserFromDB,
  updateUserIntoDB,
};

import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { UploadServices } from './upload.service';

const uploadImage = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.NOT_FOUND, 'Image file is required');
  }

  const folder = req.body.folder;

  const result = await UploadServices.uploadImageIntoCloudinary(
    req.file.buffer,
    folder,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Image uploaded successfully',
    data: result,
  });
});

export const UploadControllers = {
  uploadImage,
};

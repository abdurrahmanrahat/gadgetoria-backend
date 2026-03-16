import { Buffer } from 'buffer';
import streamifier from 'streamifier';
import cloudinary from '../../utils/cloudinary';
import { TUploadResponse } from './upload.interface';

const uploadImageIntoCloudinary = (
  buffer: Buffer,
  folder?: string,
): Promise<TUploadResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || 'uploads',
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result?.secure_url as string,
          public_id: result?.public_id as string,
        });
      },
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const UploadServices = {
  uploadImageIntoCloudinary,
};

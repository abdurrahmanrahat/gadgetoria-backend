import { z } from 'zod';

const uploadImageSchema = z.object({
  folder: z.string().optional(),
});

export const UploadValidations = {
  uploadImageSchema,
};

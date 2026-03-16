import express from 'express';
import { upload } from '../../middlewares/multer';
import { UploadControllers } from './upload.controller';

const router = express.Router();

router.post('/image', upload.single('image'), UploadControllers.uploadImage);

export const UploadRoutes = router;

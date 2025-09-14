import multer from 'multer';
import createHttpError from 'http-errors';

const storage = multer.memoryStorage();

const MAX_FILE_SIZE = Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const fileFilter = (_req, file, cb) => {
  if (!ALLOWED.includes(file.mimetype)) {
    return cb(createHttpError(400, 'Only image files are allowed (jpg, png, webp, gif)'));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});
import { v2 as cloudinary } from 'cloudinary';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_FOLDER = 'contacts',
} = process.env;

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export const uploadImageBuffer = async (buffer, mimetype) => {
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64}`;

  const res = await cloudinary.uploader.upload(dataUri, {
    folder: CLOUDINARY_UPLOAD_FOLDER,
    resource_type: 'image',
  });

  return {
    url: res.secure_url,
    publicId: res.public_id,
  };
};
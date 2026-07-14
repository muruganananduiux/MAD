const { cloudinary } = require('../config/cloudinary.config');

const uploadToCloudinary = async (file, folder) => {
  const result = await cloudinary.uploader.upload(file.path, { folder });
  return result.secure_url;
};

const deleteFromCloudinary = async (url) => {
  const publicId = url.split('/').pop().split('.')[0];
  await cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };

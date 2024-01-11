const cloudinary = require("cloudinary");
require("dotenv").config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  api_key: process.env.CLOUDINARY_API_KEY,
});

const uploadImageToCloud = async (fileToUploads) => {
  return new Promise((resolve) => {
    cloudinary.v2.uploader.upload(fileToUploads, (result) => {
      resolve(
        {
          url: result.secure_url,
        },
        {
          resource_type: "auto",
        }
      );
    });
  });
};

module.exports = uploadImageToCloud;

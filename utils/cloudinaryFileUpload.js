const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryFileUpload = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //else upload the file!!
    const uplaodedFile = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "image", //CoverImage matra lina lako vayera image lai matra handle gareko!!
    });

    console.log(`File uploaded successfully: ${uplaodedFile.url}`);
    //file uplaoded successfully
    //remove file from local server:
    fs.unlinkSync(localFilePath);

    return uplaodedFile;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    return null;
  }
};

//Kunai blog ko image update garnu pare, original image lai overwrite garna ko lagi
const cloudinaryFileDelete = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    await cloudinary.uploader.destroy(localFilePath);
  } catch (error) {
    return null;
  }
};

module.exports = {
  cloudinaryFileUpload,
  cloudinaryFileDelete,
};

const prisma = require("../prisma/index");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const { cloudinaryFileUpload } = require("../utils/cloudinaryFileUpload");

//extract publicId of Asset stored on cloudinary so that it can be overwritten
function extractPublicId(cloudinaryUrl) {
  // Check if the URL is valid
  if (!cloudinaryUrl.startsWith("http://res.cloudinary.com/")) {
    return null;
  }

  // Split the URL by "/"
  const parts = cloudinaryUrl.split("/");

  // Find the index of "upload" in the URL
  const uploadIndex = parts.indexOf("upload");

  // If "upload" is not found or if it's the last part of the URL, return null
  if (uploadIndex === -1 || uploadIndex === parts.length - 1) {
    return null;
  }

  // The public_id is the part after "upload"
  const publicIdWithExtension = parts[uploadIndex + 2];

  // Split the publicId by dot (.) and return the first part
  return publicIdWithExtension.split(".")[0];
}

//getAllBlogs
const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    let page = Number(req.query.page) || 1;
    let limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const allBlogs = await prisma.post.findMany({
      skip: skip,
      take: limit,
    });

    return res.status(200).json({
      message: "Blogs fetched successfully!!",
      blogs: allBlogs,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

//Creating the blog post
const createBlog = asyncHandler(async (req, res) => {
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400);
    throw new Error("All the fields are required!!");
  }

  const slug = slugify(title, { lower: true });

  //Yedi request ma file aako chha ra tesma coverImage naam vayeko array chha vane tyo array ko first index ma vako file ko path line
  //const coverImageLocalPath = req.file?.coverImage?.path;
  // let coverImageLocalPath;
  // if (
  //   req.file &&
  //   Array.isArray(req.file.coverImage) &&
  //   req.file.coverImage.length > 0
  // ) {
  //   coverImageLocalPath = req.file.coverImage[0].path;
  // }

  // if (!coverImageLocalPath) {
  //   res.status(400);
  //   throw new Error("Cover-Image not available!!");
  // }

  // Check if cover image is available in the request
  if (!req.file || !req.file.coverImage) {
    res.status(400);
    throw new Error("Cover-Image not available!!");
  }

  // Get the local path of the uploaded cover image
  const coverImageLocalPath = req.file.coverImage[0].path;

  const coverImage = await cloudinaryFileUpload(coverImageLocalPath);

  //Just for safety, checking if coverImage is uplaoded or not
  if (!coverImage.url) {
    res.status(400);
    throw new Error("Cover-Image uploading failed!!");
  }

  const createdPost = await prisma.post.create({
    title,
    body,
    slug: slug,
    coverImage: coverImage.url,
  });

  return res.status(200).json({
    message: "Blog posted successfully!!",
    blog: createdPost,
  });
});

module.exports = {
  getAllBlogs,
  createBlog,
};

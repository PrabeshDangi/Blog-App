const prisma = require("../prisma/index");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const {
  cloudinaryFileUpload,
  cloudinaryFileDelete,
} = require("../utils/cloudinaryFileUpload");
const verifyJWT = require("../Middlewares/authentication.Middleware");

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
  console.log(req.file);

  //Yedi request ma file aako chha ra tesma coverImage naam vayeko array chha vane tyo array ko first index ma vako file ko path line
  const coverImageLocalPath = req.file?.path;
  console.log(req.file);
  // let coverImageLocalPath;
  // if (
  //   req.file &&
  //   Array.isArray(req.file) &&
  //   req.file.length > 0
  // ) {
  //   coverImageLocalPath = req.file?.path;
  // }

  if (!coverImageLocalPath) {
    res.status(400);
    throw new Error("Cover Image not available!!");
  }

  const coverImage = await cloudinaryFileUpload(coverImageLocalPath);
  //console.log(coverImage);

  //Just for safety, checking if coverImage is uplaoded or not
  if (!coverImage.url) {
    return res.status(400);
    throw new Error("Cover-Image uploading failed!!");
  }

  const createdPost = await prisma.post.create({
    data: {
      title,
      body,
      slug: slug,
      coverImage: coverImage.url,
      author: {
        connect: { id: req.user.id }, // Connect the post to the author user
      },
    },
  });

  return res.status(200).json({
    message: "Blog posted successfully!!",
    blog: createdPost,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, body } = req.body;

    // Use Prisma to fetch the original post data from the database
    // console.log(postId);

    const originalPost = await prisma.post.findUnique({
      where: { id: postId },
      //select: { authorId: true }, // Select the author ID of the post
    });

    if (!originalPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if the authenticated user is the author of the post
    if (originalPost.authorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access: You are not the author of this post",
      });
    }

    // Update only the specified fields of the post
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { title, body },
    });

    // Return the updated post as a response
    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
});

const updateCoverImage = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const newcoverImage = req.file?.path;

  try {
    const originalPost = await prisma.post.findUnique({
      where: { id: Number(postId) },
      select: { authorId: true },
    });

    if (!originalPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (originalPost.authorId != req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access: You are not the author of this post",
      });
    }
    //retrieve old image url as:
    const oldImageUrl = originalPost.coverImage;

    //extract public_id as:
    const public_id = await extractPublicId(oldImageUrl);

    const newImageUrl = await cloudinaryFileUpload(newcoverImage);

    const updatedBlog = await prisma.post.update({
      where: { id: Number(postId) },
      data: { newImageUrl },
    });

    res.status(200).json({
      success: true,
      message: "CoverImage updated successfully",
      post: updatedBlog,
    });
    await cloudinaryFileDelete(public_id);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update post",
    });
  }
});

module.exports = {
  getAllBlogs,
  createBlog,
  updateBlog,
  updateCoverImage,
};

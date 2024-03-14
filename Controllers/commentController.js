const prisma = require("../prisma/index");
//const asyncHandler=require("express-async-handler")

const createComment = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.id;

    if (!content) {
      return res.status(400).json({ error: "Comment content is required!" });
    }

    const postAvailable = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!postAvailable) {
      return res.status(404).json({ error: "Post not found!!" });
    }

    const createdComment = await prisma.comment.create({
      data: {
        content,
        author: { connect: { id: userId } },
        post: { connect: { id: postId } },
      },
    });

    return res.status(200).json({
      message: "Commented successfully!!",
      Comment: createdComment,
    });
  } catch (error) {
    console.log("Error while creating the comment!!");
    return res.status(500).json({
      Error: error.message,
    });
  }
};

const getAllComments = async (req, res) => {
  try {
    const postId = req.params.id;
    //console.log(postId);
    const postAvailable = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!postAvailable) {
      return res.status(404).json({
        error: "Post not available!!",
      });
    }

    const allComments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      select: {
        content: true,
        updatedAt: true,
        authorId: true,
      },
    });

    if (!allComments || allComments.length === 0) {
      return res.status(404).json({
        Message: "No comments for this post available!!",
      });
    }

    return res.status(200).json({
      message: "Comment fetched successfully!!",
      comments: allComments,
    });
  } catch (error) {
    console.log("Error fetching the comments!!:", error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  createComment,
  getAllComments,
};

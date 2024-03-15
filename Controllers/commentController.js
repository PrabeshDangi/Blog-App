const prisma = require("../prisma/index");
//const asyncHandler=require("express-async-handler")

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
    const totalComments = allComments.length;

    if (!allComments || allComments.length === 0) {
      return res.status(404).json({
        Message: "No comments for this post available!!",
      });
    }

    return res.status(200).json({
      message: "Comment fetched successfully!!",
      comments: allComments,
      totalNumberOfComments: totalComments,
    });
  } catch (error) {
    console.log("Error fetching the comments!!:", error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
};

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

const updateComment = async (req, res) => {
  const { content } = req.body;
  const commentId = req.params.id;

  if (!content) {
    return res.status(400).json({
      error: "Comment content unavailable!!",
    });
  }

  if (!commentId) {
    return res.status(404).json({
      error: "Comment Unavailable!!",
    });
  }

  const updatedComment = await prisma.comment.update({
    where: { id: commentId },
    data: { content },
  });

  return res.status(200).json({
    message: "Comment updated successfully!!",
    comment: content,
  });
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  if (!commentId) {
    return res.status(404).json({
      error: "Comment not found!!",
    });
  }
  await prisma.comment.delete({
    where: { id: commentId },
  });

  return res.status(200).json({
    message: "Comment deleted successfully!!",
  });
};

module.exports = {
  getAllComments,
  createComment,
  updateComment,
  deleteComment,
};

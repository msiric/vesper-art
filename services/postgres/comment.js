import { Comment } from "../../entities/Comment";

// $Needs testing (mongo -> postgres)
export const fetchCommentById = async ({ artworkId, commentId }) => {
  return await Comment.findOne({
    where: [{ id: commentId }, { artwork: artworkId }],
    relations: ["owner"],
  });
};

// $Needs testing (mongo -> postgres)
export const addNewComment = async ({ artworkId, userId, commentContent }) => {
  const newComment = new Comment();
  newComment.artwork = artworkId;
  newComment.owner = userId;
  newComment.content = commentContent;
  newComment.modified = false;
  newComment.generated = false;
  return await newComment.save();
};

// $Needs testing (mongo -> postgres)
export const editExistingComment = async ({
  commentId,
  artworkId,
  userId,
  commentContent,
}) => {
  const foundComment = await Comment.findOne({
    where: [{ id: commentId }, { artwork: artworkId }, { owner: userId }],
  });
  foundComment.content = commentContent;
  foundComment.modified = true;
  return await Comment.save({ foundComment });
};

// $Needs testing (mongo -> postgres)
export const removeExistingComment = async ({
  commentId,
  artworkId,
  userId,
}) => {
  const foundComment = await Comment.findOne({
    where: [{ id: commentId }, { artwork: artworkId }, { owner: userId }],
  });
  return await Comment.remove({ foundComment });
};

import { Comment } from "../../entities/Comment";

// $Needs testing (mongo -> postgres)
export const fetchCommentById = async ({
  artworkId,
  commentId,
  connection,
}) => {
  // return await Comment.findOne({
  //   where: [{ id: commentId, artwork: artworkId }],
  //   relations: ["owner"],
  // });

  const foundComment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .where("comment.id = :commentId AND comment.artworkId = :artworkId", {
      commentId: commentId,
      artworkId: artworkId,
    })
    .getOne();
  console.log(foundComment);
  return foundComment;
};

// $Needs testing (mongo -> postgres)
export const addNewComment = async ({
  commentId,
  artworkId,
  userId,
  commentContent,
  connection,
}) => {
  /*   const newComment = new Comment();
  newComment.artwork = artworkId;
  newComment.owner = userId;
  newComment.content = commentContent;
  newComment.modified = false;
  newComment.generated = false;
  return await Comment.save(newComment); */

  const savedComment = await connection
    .createQueryBuilder()
    .insert()
    .into(Comment)
    .values([
      {
        id: commentId,
        artworkId,
        ownerId: userId,
        content: commentContent,
        modified: false,
        generated: false,
      },
    ])
    .execute();
  console.log(savedComment);
  return savedComment;
};

// $Needs testing (mongo -> postgres)
export const editExistingComment = async ({
  commentId,
  artworkId,
  userId,
  commentContent,
  connection,
}) => {
  /*   const foundComment = await Comment.findOne({
    where: [{ id: commentId, artwork: artworkId, owner: userId }],
  });
  foundComment.content = commentContent;
  foundComment.modified = true;
  return await Comment.save(foundComment); */

  const updatedComment = await connection
    .createQueryBuilder()
    .update(Comment)
    .set({ content: commentContent, modified: true })
    .where("id = :commentId AND artworkId = :artworkId AND ownerId = :userId", {
      commentId,
      artworkId,
      userId,
    })
    .execute();
  console.log(updatedComment);
  return updatedComment;
};

// $Needs testing (mongo -> postgres)
export const removeExistingComment = async ({
  commentId,
  artworkId,
  userId,
  connection,
}) => {
  /*   const foundComment = await Comment.findOne({
    where: [{ id: commentId, artwork: artworkId, owner: userId }],
  });
  return await Comment.remove(foundComment); */

  const deletedComment = await connection
    .createQueryBuilder()
    .delete()
    .from(Comment)
    .where("id = :commentId AND artworkId = :artworkId AND ownerId = :userId", {
      commentId,
      artworkId,
      userId,
    })
    .execute();
  console.log(deletedComment);
  return deletedComment;
};

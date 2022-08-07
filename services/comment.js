import { ArtworkVisibility } from "../entities/Artwork";
import { Comment } from "../entities/Comment";

const VISIBILITY_STATUS = ArtworkVisibility.visible;

export const fetchCommentById = async ({
  artworkId,
  commentId,
  connection,
}) => {
  const foundComment = await connection
    .getRepository(Comment)
    .createQueryBuilder("comment")
    .leftJoinAndSelect("comment.artwork", "artwork")
    .leftJoinAndSelect("comment.owner", "owner")
    .leftJoinAndSelect("owner.avatar", "avatar")
    .where(
      // $TODO should artwork.active be checked as well?
      "comment.id = :commentId AND comment.artworkId = :artworkId AND artwork.visibility = :visibility",
      {
        commentId,
        artworkId,
        visibility: VISIBILITY_STATUS,
      }
    )
    .getOne();
  return foundComment;
};

export const addNewComment = async ({
  commentId,
  artworkId,
  userId,
  commentContent,
  connection,
}) => {
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
    .returning("*")
    .execute();
  return savedComment;
};

export const editExistingComment = async ({
  commentId,
  userId,
  commentContent,
  connection,
}) => {
  const updatedComment = await connection
    .createQueryBuilder()
    .update(Comment)
    .set({ content: commentContent, modified: true })
    .where(
      // $TODO should artwork.active and artwork.visibility be checked as well?
      'id = :commentId AND "ownerId" = :userId',
      {
        commentId,
        userId,
      }
    )
    .execute();
  return updatedComment;
};

export const removeExistingComment = async ({
  commentId,
  userId,
  connection,
}) => {
  const deletedComment = await connection
    .createQueryBuilder()
    .delete()
    .from(Comment)
    .where('id = :commentId AND "ownerId" = :userId', {
      commentId,
      userId,
    })
    .execute();
  return deletedComment;
};

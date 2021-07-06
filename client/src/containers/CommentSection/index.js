import { yupResolver } from "@hookform/resolvers/yup";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import queryString from "query-string";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import CommentCard from "../../components/CommentCard/index";
import CommentPopover from "../../components/CommentPopover";
import InfiniteList from "../../components/InfiniteList";
import MainHeading from "../../components/MainHeading";
import PromptModal from "../../components/PromptModal";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkComments } from "../../contexts/local/artworkComments";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import List from "../../domain/List";
import AddCommentForm from "../../forms/CommentForm/index";
import useVisibleElement from "../../hooks/useVisibleElement";
import commentSectionStyles from "./styles";

const CommentSection = ({
  paramId,
  commentsRef,
  highlightRef,
  commentsFetched,
}) => {
  const artworkId = useArtworkDetails((state) => state.artwork.data.id);
  const artworkOwnerId = useArtworkDetails(
    (state) => state.artwork.data.owner.id
  );

  const loading = useArtworkDetails((state) => state.artwork.loading);

  const comments = useArtworkComments((state) => state.comments.data);
  const fetching = useArtworkComments((state) => state.comments.fetching);
  const error = useArtworkComments((state) => state.comments.error);
  const edits = useArtworkComments((state) => state.edits);
  const popover = useArtworkComments((state) => state.popover);
  const modal = useArtworkComments((state) => state.modal);
  const highlight = useArtworkComments((state) => state.highlight);
  const hasMore = useArtworkComments((state) => state.comments.hasMore);
  const isDeleting = useArtworkComments((state) => state.isDeleting);
  const fetchComments = useArtworkComments((state) => state.fetchComments);
  const addComment = useArtworkComments((state) => state.addComment);
  const updateComment = useArtworkComments((state) => state.updateComment);
  const deleteComment = useArtworkComments((state) => state.deleteComment);
  const openComment = useArtworkComments((state) => state.openComment);
  const closeComment = useArtworkComments((state) => state.closeComment);
  const openPopover = useArtworkComments((state) => state.openPopover);
  const closePopover = useArtworkComments((state) => state.closePopover);
  const openModal = useArtworkComments((state) => state.openModal);
  const closeModal = useArtworkComments((state) => state.closeModal);

  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);
  const userAvatar = useUserStore((state) => state.avatar);

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const isVisible = useVisibleElement(commentsRef, commentsFetched.current);
  const query = queryString.parse(location.search);
  const classes = commentSectionStyles();

  const { getValues, handleSubmit, formState, errors, control, reset } =
    useForm({
      defaultValues: {
        commentContent: "",
      },
      resolver: yupResolver(commentValidation),
    });

  useEffect(() => {
    if (
      (!commentsFetched.current && isVisible) ||
      (!commentsFetched.current && query.notif === "comment" && query.ref)
    ) {
      fetchComments({
        artworkId: paramId,
        query,
        highlightRef,
        enqueueSnackbar,
      });
      commentsFetched.current = true;
    }
  }, [isVisible]);

  return (
    <Card>
      <CardContent>
        <MainHeading text="Comments" className={classes.heading} />
        <Divider />
        <FormProvider control={control}>
          <form
            onSubmit={handleSubmit(
              async () =>
                await addComment({
                  artworkId,
                  userData: {
                    id: userId,
                    name: userUsername,
                    avatar: userAvatar,
                  },
                  values: getValues(),
                  reset,
                })
            )}
          >
            <AddCommentForm errors={errors} loading={loading} />
            <AsyncButton
              type="submit"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              loading={loading}
              startIcon={<UploadIcon />}
            >
              Post
            </AsyncButton>
          </form>
        </FormProvider>
        <Divider />
        <InfiniteList
          dataLength={comments ? comments.length : 0}
          next={() =>
            fetchComments({ artworkId, query, highlightRef, enqueueSnackbar })
          }
          hasMore={hasMore}
          loading={loading || fetching}
          error={error.refetch}
          empty="No comments yet"
        >
          <List ref={commentsRef} className={classes.list} disablePadding>
            <Box>
              {comments.map((comment) => (
                <CommentCard
                  artworkId={artworkId}
                  artworkOwnerId={artworkOwnerId}
                  comment={comment}
                  edits={edits}
                  queryRef={query ? query.ref : null}
                  highlightRef={highlightRef}
                  handleCommentClose={closeComment}
                  handleCommentEdit={updateComment}
                  handlePopoverOpen={openPopover}
                  loading={false}
                />
              ))}
            </Box>
            {highlight.element && (
              <CommentCard
                artworkId={artworkId}
                artworkOwnerId={artworkOwnerId}
                comment={highlight.element}
                edits={edits}
                queryRef={query ? query.ref : null}
                highlightRef={highlightRef}
                handleCommentClose={closeComment}
                handleCommentEdit={updateComment}
                handlePopoverOpen={openPopover}
                loading={false}
              />
            )}
          </List>
        </InfiniteList>
      </CardContent>
      <CommentPopover
        artworkId={artworkId}
        id={popover.id}
        anchorEl={popover.anchorEl}
        open={popover.open}
        handleCommentOpen={openComment}
        handleModalOpen={openModal}
        handlePopoverClose={closePopover}
      />
      <PromptModal
        open={modal.open}
        handleConfirm={() => deleteComment({ artworkId, commentId: modal.id })}
        handleClose={closeModal}
        ariaLabel="Delete comment"
        promptTitle="Are you sure you want to delete this comment?"
        promptConfirm="Delete"
        promptCancel="Cancel"
        isSubmitting={isDeleting}
      />
    </Card>
  );
};

export default CommentSection;

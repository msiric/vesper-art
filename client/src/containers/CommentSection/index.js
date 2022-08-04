import CommentList from "@containers/CommentList";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ArrowUpwardRounded as SubmitIcon,
  DeleteOutlineRounded as DeleteIcon,
} from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import CommentPopover from "../../components/CommentPopover";
import MainHeading from "../../components/MainHeading";
import PromptModal from "../../components/PromptModal";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkComments } from "../../contexts/local/artworkComments";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Card from "../../domain/Card";
import CardContent from "../../domain/CardContent";
import Divider from "../../domain/Divider";
import CommentForm from "../../forms/CommentForm/index";
import { isFormDisabled } from "../../utils/helpers";
import commentSectionStyles from "./styles";

const CommentSection = ({
  artworkId,
  commentsRef,
  highlightRef,
  commentsFetched,
}) => {
  const loading = useArtworkDetails((state) => state.artwork.loading);

  const popover = useArtworkComments((state) => state.popover);
  const modal = useArtworkComments((state) => state.modal);
  const isDeleting = useArtworkComments((state) => state.isDeleting);
  const addComment = useArtworkComments((state) => state.addComment);
  const deleteComment = useArtworkComments((state) => state.deleteComment);
  const openComment = useArtworkComments((state) => state.openComment);
  const closePopover = useArtworkComments((state) => state.closePopover);
  const openModal = useArtworkComments((state) => state.openModal);
  const closeModal = useArtworkComments((state) => state.closeModal);

  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);
  const userAvatar = useUserStore((state) => state.avatar);

  const classes = commentSectionStyles();

  const setDefaultValues = () => ({
    commentContent: "",
  });

  const { getValues, handleSubmit, formState, errors, control, watch, reset } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(commentValidation),
    });

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  return (
    <Card>
      <CardContent className={classes.wrapper}>
        <MainHeading text="Comments" className={classes.heading} />
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
            <CommentForm errors={errors} loading={loading} />
            <AsyncButton
              type="submit"
              color="secondary"
              fullWidth
              padding
              submitting={formState.isSubmitting}
              disabled={isDisabled}
              loading={loading}
              startIcon={<SubmitIcon />}
              className={classes.button}
            >
              Post
            </AsyncButton>
          </form>
        </FormProvider>
        <Divider />
        <CommentList
          artworkId={artworkId}
          commentsRef={commentsRef}
          highlightRef={highlightRef}
          commentsFetched={commentsFetched}
        />
      </CardContent>
      <CommentPopover
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
        startIcon={<DeleteIcon />}
      />
    </Card>
  );
};

export default CommentSection;

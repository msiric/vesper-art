import { yupResolver } from "@hookform/resolvers/yup";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import {
  AddCircleRounded as UploadIcon,
  MoreVertRounded as MoreIcon,
} from "@material-ui/icons";
import { formatDistance } from "date-fns";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import AddCommentForm from "../../forms/CommentForm/index.js";
import { Typography } from "../../styles/theme.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import commentCardStyles from "./styles.js";

const CommentCard = ({
  artworkId,
  artworkOwnerId,
  comment = { content: "" },
  edits = {},
  queryRef,
  highlightRef,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const userId = useUserStore((state) => state.id);

  const setDefaultValues = () => ({
    commentContent: comment.content,
  });

  const {
    getValues,
    handleSubmit,
    formState,
    errors,
    control,
    reset,
  } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(commentValidation),
  });

  const history = useHistory();
  const classes = commentCardStyles();

  const isHighlight = () => queryRef && queryRef === comment.id;

  useEffect(() => {
    reset(setDefaultValues());
  }, [comment.content]);

  return (
    <Box ref={isHighlight() ? highlightRef : null} key={comment.id}>
      <ListItem
        alignItems="flex-start"
        disableGutters
        className={`${classes.commentContainer} ${
          isHighlight() ? classes.highlightContainer : ""
        }`}
      >
        <ListItemAvatar>
          <SkeletonWrapper
            loading={loading}
            variant="circle"
            styles={{ paddingTop: 40, width: 40 }}
          >
            <Avatar
              alt={comment.owner.name}
              src={comment.owner.avatar ? comment.owner.avatar.source : null}
              component={Link}
              to={`/user/${comment.owner.name}`}
              className={classes.noLink}
            />
          </SkeletonWrapper>
        </ListItemAvatar>
        <ListItemText
          primary={
            edits[comment.id] ? null : (
              <SkeletonWrapper variant="text" loading={loading}>
                <Typography
                  component={Link}
                  to={`/user/${comment.owner.name}`}
                  style={{ textDecoration: "none" }}
                  color="text.primary"
                >
                  {comment.owner.id === artworkOwnerId
                    ? `${comment.owner.name} 👤`
                    : comment.owner.name}
                </Typography>
                <Typography
                  component="span"
                  color="text.secondary"
                  style={{ marginLeft: 6 }}
                >
                  {`${formatDistance(
                    new Date(comment.created),
                    new Date()
                  )} ago`}
                </Typography>
                <Typography
                  component="span"
                  color="text.secondary"
                  style={{ marginLeft: 6 }}
                >
                  {comment.modified ? "(edited)" : null}
                </Typography>
              </SkeletonWrapper>
            )
          }
          secondary={
            edits[comment.id] ? (
              <FormProvider control={control}>
                <form
                  onSubmit={handleSubmit(() =>
                    handleCommentEdit({
                      artworkId,
                      commentId: comment.id,
                      values: getValues(),
                    })
                  )}
                >
                  <AddCommentForm errors={errors} loading={loading} />
                  <AsyncButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    padding
                    submitting={formState.isSubmitting}
                    loading={loading}
                    startIcon={<UploadIcon />}
                  >
                    Publish
                  </AsyncButton>
                  <Button
                    type="button"
                    variant="outlined"
                    color="warning"
                    onClick={() =>
                      handleCommentClose({ commentId: comment.id })
                    }
                  >
                    Cancel
                  </Button>
                </form>
              </FormProvider>
            ) : (
              <SkeletonWrapper variant="text" loading={loading} width="90%">
                <Typography>
                  {comment.content || "Could not load content"}
                </Typography>
              </SkeletonWrapper>
            )
          }
        />
        {edits[comment.id] || comment.owner.id !== userId ? null : (
          <ListItemSecondaryAction>
            <IconButton
              onClick={(e) =>
                handlePopoverOpen({
                  commentId: comment.id,
                  commentTarget: e.currentTarget,
                })
              }
              edge="end"
              aria-label="More"
            >
              <MoreIcon />
            </IconButton>
          </ListItemSecondaryAction>
        )}
      </ListItem>
      <Divider />
    </Box>
  );
};

export default CommentCard;

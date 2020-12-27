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
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import AsyncButton from "../../components/AsyncButton/index.js";
import { useTracked as useUserContext } from "../../contexts/User.js";
import AddCommentForm from "../../forms/CommentForm/index.js";
import { patchComment } from "../../services/artwork.js";
import { Typography } from "../../styles/theme.js";
import { commentValidation } from "../../validation/comment.js";
import SkeletonWrapper from "../SkeletonWrapper/index.js";
import commentCardStyles from "./styles.js";

const CommentCard = ({
  artwork = {},
  comment = { content: "" },
  edits = {},
  queryRef,
  highlightRef,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const [userStore, userDispatch] = useUserContext();

  const setDefaultValues = () => ({
    commentContent: comment.content,
  });

  const { handleSubmit, formState, errors, control, reset } = useForm({
    defaultValues: setDefaultValues(),
    resolver: yupResolver(commentValidation),
  });

  const onSubmit = async (values) => {
    await patchComment.request({
      artworkId: artwork._id,
      commentId: comment._id,
      data: values,
    });
    handleCommentEdit(comment._id, values.commentContent);
  };

  const history = useHistory();
  const classes = commentCardStyles();

  const isHighlight = () => queryRef && queryRef === comment._id;

  useEffect(() => {
    reset(setDefaultValues());
  }, [comment.content]);

  return (
    <Box ref={isHighlight() ? highlightRef : null} key={comment._id}>
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
              src={comment.owner.avatar}
              component={Link}
              to={`/user/${comment.owner.name}`}
              className={classes.noLink}
            />
          </SkeletonWrapper>
        </ListItemAvatar>
        <ListItemText
          primary={
            edits[comment._id] ? null : (
              <SkeletonWrapper variant="text" loading={loading}>
                <Typography
                  component={Link}
                  to={`/user/${comment.owner.name}`}
                  style={{ textDecoration: "none" }}
                  color="text.primary"
                >
                  {comment.owner.name || "Could not load user"}
                </Typography>
                <Typography
                  component="span"
                  color="text.secondary"
                  fontStyle="oblique"
                  style={{ marginLeft: 6 }}
                >
                  {comment.modified ? "edited" : null}
                </Typography>
              </SkeletonWrapper>
            )
          }
          secondary={
            edits[comment._id] ? (
              <FormProvider control={control}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <AddCommentForm errors={errors} loading={loading} />
                  <AsyncButton
                    type="submit"
                    fullWidth
                    variant="outlined"
                    color="primary"
                    padding
                    loading={formState.isSubmitting}
                    startIcon={<UploadIcon />}
                  >
                    Publish
                  </AsyncButton>
                  <Button
                    type="button"
                    variant="outlined"
                    color="warning"
                    onClick={() => handleCommentClose(comment._id)}
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
        {edits[comment._id] || comment.owner._id !== userStore.id ? null : (
          <ListItemSecondaryAction>
            <IconButton
              onClick={(e) => handlePopoverOpen(e, comment._id)}
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

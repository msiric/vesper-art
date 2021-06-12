import { yupResolver } from "@hookform/resolvers/yup";
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
import SyncButton from "../../components/SyncButton/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import IconButton from "../../domain/IconButton";
import ListItem from "../../domain/ListItem";
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemSecondaryAction from "../../domain/ListItemSecondaryAction";
import ListItemText from "../../domain/ListItemText";
import Typography from "../../domain/Typography";
import AddCommentForm from "../../forms/CommentForm/index.js";
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
        disableGutters
        className={`${classes.container} ${
          isHighlight() ? classes.highlight : ""
        }`}
      >
        <ListItemAvatar>
          <Avatar
            alt={comment.owner.name}
            src={comment.owner.avatar ? comment.owner.avatar.source : null}
            component={Link}
            to={`/user/${comment.owner.name}`}
            loading={loading}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            edits[comment.id] ? null : (
              <Box>
                <Typography
                  component={Link}
                  to={`/user/${comment.owner.name}`}
                  style={{ textDecoration: "none" }}
                  loading={loading}
                >
                  {comment.owner.id === artworkOwnerId
                    ? `${comment.owner.name} 👤`
                    : comment.owner.name}
                </Typography>
                <Typography
                  component="span"
                  style={{ marginLeft: 6 }}
                  loading={loading}
                >
                  {`${formatDistance(
                    new Date(comment.created),
                    new Date()
                  )} ago`}
                </Typography>
                <Typography
                  component="span"
                  style={{ marginLeft: 6 }}
                  loading={loading}
                >
                  {comment.modified ? "(edited)" : null}
                </Typography>
              </Box>
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
                    padding
                    submitting={formState.isSubmitting}
                    loading={loading}
                    startIcon={<UploadIcon />}
                  >
                    Publish
                  </AsyncButton>
                  <SyncButton
                    type="button"
                    color="warning"
                    onClick={() =>
                      handleCommentClose({ commentId: comment.id })
                    }
                  >
                    Cancel
                  </SyncButton>
                </form>
              </FormProvider>
            ) : (
              <Typography loading={loading}>
                {comment.content || "Could not load content"}
              </Typography>
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

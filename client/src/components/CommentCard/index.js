import IncrementCounter from "@components/IncrementCounter";
import LikeButton from "@components/LikeButton";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  CheckRounded as SaveIcon,
  CloseRounded as CloseIcon,
  MoreVertRounded as MoreIcon,
} from "@material-ui/icons";
import { formatDistance } from "date-fns";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { commentValidation } from "../../../../common/validation";
import { useUserStore } from "../../contexts/global/user";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import IconButton from "../../domain/IconButton";
import ListItem from "../../domain/ListItem";
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemSecondaryAction from "../../domain/ListItemSecondaryAction";
import ListItemText from "../../domain/ListItemText";
import Tooltip from "../../domain/Tooltip";
import Typography from "../../domain/Typography";
import CommentForm from "../../forms/CommentForm/index";
import {
  isFormDisabled,
  renderRedirectLink,
  renderUserData,
} from "../../utils/helpers";
import AsyncButton from "../AsyncButton/index";
import SyncButton from "../SyncButton/index";
import commentCardStyles from "./styles";

const CommentCard = ({
  artworkId,
  artworkOwnerId,
  comment = { content: "", owner: { avatar: {} }, likes: [] },
  edits = {},
  queryRef,
  highlightRef,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const [likes, setLikes] = useState([]);

  const userId = useUserStore((state) => state.id);

  const isCommentLiked = likes?.some((like) => like.ownerId === userId);
  const isCommentDisabled = comment?.owner?.id === userId;

  const setDefaultValues = () => ({
    commentContent: comment.content,
  });

  const { getValues, handleSubmit, formState, errors, control, watch, reset } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(commentValidation),
    });

  watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  const isHighlight = queryRef && queryRef === comment.id;
  const shouldBlink = isHighlight && highlightRef.current;

  const classes = commentCardStyles();

  const handleLikeToggle = (liked) => {
    if (liked) {
      setLikes((prevState) => [...prevState, { ownerId: userId }]);
    } else {
      setLikes((prevState) =>
        prevState.filter((like) => like.ownerId !== userId)
      );
    }
  };

  useEffect(() => {
    reset(setDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comment.content]);

  useEffect(() => {
    setLikes(comment.likes);
  }, [comment.likes]);

  return (
    <Box ref={isHighlight ? highlightRef : null} key={comment.id}>
      <ListItem
        disableGutters
        alignItems="flex-start"
        className={`${classes.container} ${
          shouldBlink ? classes.highlight : ""
        }`}
      >
        <ListItemAvatar className={classes.avatar}>
          <Avatar
            src={comment?.owner?.avatar?.source ?? null}
            component={renderRedirectLink({
              active: comment?.owner?.active,
              isUsername: false,
            })}
            to={`/user/${comment?.owner?.name}`}
            loading={loading}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            edits[comment?.id] ? null : (
              <Box className={classes.wrapper}>
                <Typography
                  component={renderRedirectLink({
                    active: comment?.owner?.active,
                    isUsername: true,
                  })}
                  to={`/user/${comment?.owner?.name}`}
                  loading={loading}
                  className={classes.owner}
                >
                  {comment?.owner?.id === artworkOwnerId ? (
                    <Box className={classes.author}>
                      {renderUserData({
                        data: comment?.owner?.name,
                        isUsername: true,
                      })}
                      <Tooltip title="OP" placement="top" arrow>
                        <span role="img" aria-label="OP">
                          &nbsp;🎨
                        </span>
                      </Tooltip>
                    </Box>
                  ) : (
                    renderUserData({
                      data: comment?.owner?.name,
                      isUsername: true,
                    })
                  )}
                </Typography>
              </Box>
            )
          }
          secondary={
            edits[comment?.id] ? (
              <FormProvider control={control}>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(
                    async () =>
                      await handleCommentEdit({
                        userId,
                        commentId: comment?.id,
                        values: getValues(),
                      })
                  )}
                >
                  <CommentForm
                    getValues={getValues}
                    errors={errors}
                    loading={loading}
                  />
                  <Box className={classes.actions}>
                    <AsyncButton
                      type="submit"
                      color="secondary"
                      fullWidth
                      submitting={formState.isSubmitting}
                      disabled={isDisabled}
                      loading={loading}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </AsyncButton>
                    <SyncButton
                      type="button"
                      onClick={() =>
                        handleCommentClose({ commentId: comment?.id })
                      }
                      startIcon={<CloseIcon />}
                    >
                      Cancel
                    </SyncButton>
                  </Box>
                </form>
              </FormProvider>
            ) : (
              <Box className={classes.details}>
                <Typography
                  loading={loading}
                  className={classes.content}
                  preWrap
                >
                  {comment?.content ||
                    "Fetching artwork's comment content details"}
                </Typography>
                <Box className={classes.subtitle}>
                  <Box className={classes.info}>
                    <Typography
                      component="span"
                      variant="subtitle2"
                      loading={loading}
                      className={classes.created}
                    >
                      {comment?.created
                        ? `${formatDistance(
                            new Date(comment?.created),
                            new Date()
                          )} ago`
                        : "Fetching comment creation date"}
                    </Typography>
                    {comment?.modified && (
                      <Typography
                        component="span"
                        variant="subtitle2"
                        loading={loading}
                        className={classes.modified}
                      >
                        *
                      </Typography>
                    )}
                  </Box>
                  <Box loading={loading} customRadius className={classes.likes}>
                    <IncrementCounter
                      newValue={likes?.length ?? 0}
                      size="small"
                    />
                    <LikeButton
                      artworkId={artworkId}
                      comment={comment}
                      liked={isCommentLiked || isCommentDisabled}
                      disabled={isCommentDisabled}
                      handleCallback={handleLikeToggle}
                    />
                  </Box>
                </Box>
              </Box>
            )
          }
        />
        {edits[comment?.id] || comment?.owner?.id !== userId ? null : (
          <ListItemSecondaryAction className={classes.menu}>
            <IconButton
              onClick={(e) =>
                handlePopoverOpen({
                  commentId: comment?.id,
                  commentTarget: e.currentTarget,
                })
              }
              edge="end"
              aria-label="More"
              title="More"
              className={classes.button}
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

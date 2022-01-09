import { yupResolver } from "@hookform/resolvers/yup";
import {
  CheckRounded as SaveIcon,
  CloseRounded as CloseIcon,
  MoreVertRounded as MoreIcon,
} from "@material-ui/icons";
import { formatDistance } from "date-fns";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index";
import SyncButton from "../../components/SyncButton/index";
import { useUserStore } from "../../contexts/global/user";
import Avatar from "../../domain/Avatar";
import Box from "../../domain/Box";
import Divider from "../../domain/Divider";
import IconButton from "../../domain/IconButton";
import ListItem from "../../domain/ListItem";
import ListItemAvatar from "../../domain/ListItemAvatar";
import ListItemSecondaryAction from "../../domain/ListItemSecondaryAction";
import ListItemText from "../../domain/ListItemText";
import Typography from "../../domain/Typography";
import CommentForm from "../../forms/CommentForm/index";
import {
  isFormDisabled,
  renderRedirectLink,
  renderUserData,
} from "../../utils/helpers";
import commentCardStyles from "./styles";

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

  const { getValues, handleSubmit, formState, errors, control, watch, reset } =
    useForm({
      defaultValues: setDefaultValues(),
      resolver: yupResolver(commentValidation),
    });

  const watchedValues = watch();

  const isDisabled = isFormDisabled(getValues(), setDefaultValues(), formState);

  const isHighlight = queryRef && queryRef === comment.id;
  const shouldBlink = isHighlight && highlightRef.current;

  const history = useHistory();
  const classes = commentCardStyles();

  useEffect(() => {
    reset(setDefaultValues());
  }, [comment.content]);

  return (
    <Box ref={isHighlight ? highlightRef : null} key={comment.id}>
      <ListItem
        disableGutters
        alignItems="flex-start"
        className={`${classes.container} ${
          shouldBlink ? classes.highlight : ""
        }`}
      >
        <ListItemAvatar>
          <Avatar
            alt={comment.owner.name}
            src={comment.owner.avatar ? comment.owner.avatar.source : null}
            component={renderRedirectLink({
              active: comment.owner.active,
              isUsername: false,
            })}
            to={`/user/${comment.owner.name}`}
            loading={loading}
          />
        </ListItemAvatar>
        <ListItemText
          primary={
            edits[comment.id] ? null : (
              <Box className={classes.wrapper}>
                <Typography
                  component={renderRedirectLink({
                    active: comment.owner.active,
                    isUsername: true,
                  })}
                  to={`/user/${comment.owner.name}`}
                  loading={loading}
                  className={classes.owner}
                >
                  {comment.owner.id === artworkOwnerId
                    ? `${renderUserData({
                        data: comment.owner.name,
                        isUsername: true,
                      })} 🎨`
                    : renderUserData({
                        data: comment.owner.name,
                        isUsername: true,
                      })}
                </Typography>
              </Box>
            )
          }
          secondary={
            edits[comment.id] ? (
              <FormProvider control={control}>
                <form
                  className={classes.form}
                  onSubmit={handleSubmit(
                    async () =>
                      await handleCommentEdit({
                        artworkId,
                        commentId: comment.id,
                        values: getValues(),
                      })
                  )}
                >
                  <CommentForm errors={errors} loading={loading} />
                  <Box className={classes.actions}>
                    <AsyncButton
                      type="submit"
                      fullWidth
                      submitting={formState.isSubmitting}
                      disabled={isDisabled}
                      loading={loading}
                      startIcon={<SaveIcon />}
                    >
                      Publish
                    </AsyncButton>
                    <SyncButton
                      type="button"
                      color="warning"
                      onClick={() =>
                        handleCommentClose({ commentId: comment.id })
                      }
                      startIcon={<CloseIcon />}
                    >
                      Cancel
                    </SyncButton>
                  </Box>
                </form>
              </FormProvider>
            ) : (
              <Box>
                <Typography loading={loading} className={classes.content}>
                  {comment.content || "Could not load content"}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle2"
                  loading={loading}
                  className={classes.created}
                >
                  {`${formatDistance(
                    new Date(comment.created),
                    new Date()
                  )} ago`}
                </Typography>
                <Typography
                  component="span"
                  variant="subtitle2"
                  loading={loading}
                  className={classes.modified}
                >
                  {comment.modified ? "(edited)" : null}
                </Typography>
              </Box>
            )
          }
        />
        {edits[comment.id] || comment.owner.id !== userId ? null : (
          <ListItemSecondaryAction className={classes.menu}>
            <IconButton
              onClick={(e) =>
                handlePopoverOpen({
                  commentId: comment.id,
                  commentTarget: e.currentTarget,
                })
              }
              edge="end"
              aria-label="More"
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

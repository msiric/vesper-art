import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, CardContent, Divider } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import { useSnackbar } from "notistack";
import queryString from "query-string";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import CommentCard from "../../components/CommentCard/index.js";
import CommentPopover from "../../components/CommentPopover";
import EmptySection from "../../components/EmptySection/index.js";
import InfiniteList from "../../components/InfiniteList";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useUserStore } from "../../contexts/global/user";
import { useArtworkStore } from "../../contexts/local/artwork";
import { useCommentsStore } from "../../contexts/local/comments";
import AddCommentForm from "../../forms/CommentForm/index.js";
import useOnScreen from "../../hooks/useOnScreen";
import { List, Typography } from "../../styles/theme.js";
import commentSectionStyles from "./styles.js";

const CommentSection = ({
  paramId,
  commentsRef,
  highlightRef,
  commentsFetched,
}) => {
  const artworkId = useArtworkStore((state) => state.artwork.data.id);
  const artworkOwnerId = useArtworkStore(
    (state) => state.artwork.data.owner.id
  );

  const comments = useCommentsStore((state) => state.comments.data);
  const loading = useCommentsStore((state) => state.comments.loading);
  const edits = useCommentsStore((state) => state.edits);
  const popover = useCommentsStore((state) => state.popover);
  const highlight = useCommentsStore((state) => state.highlight);
  const scroll = useCommentsStore((state) => state.scroll);
  const fetchComments = useCommentsStore((state) => state.fetchComments);
  const addComment = useCommentsStore((state) => state.addComment);
  const updateComment = useCommentsStore((state) => state.updateComment);
  const deleteComment = useCommentsStore((state) => state.deleteComment);
  const openComment = useCommentsStore((state) => state.openComment);
  const closeComment = useCommentsStore((state) => state.closeComment);
  const openPopover = useCommentsStore((state) => state.openPopover);
  const closePopover = useCommentsStore((state) => state.closePopover);

  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);
  const userAvatar = useUserStore((state) => state.avatar);

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const isVisible = useOnScreen(commentsRef, commentsFetched.current);
  const query = queryString.parse(location.search);
  const classes = commentSectionStyles();

  const {
    getValues,
    handleSubmit,
    formState,
    errors,
    control,
    reset,
  } = useForm({
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
    <Card className={classes.root}>
      <CardContent>
        <Typography my={2} fontSize="h5.fontSize">
          Comments
        </Typography>
        <Divider />
        <FormProvider control={control}>
          <form
            onSubmit={handleSubmit(() =>
              addComment({
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
              variant="outlined"
              color="primary"
              padding
              loading={formState.isSubmitting}
              startIcon={<UploadIcon />}
            >
              Post
            </AsyncButton>
          </form>
        </FormProvider>

        <br />
        <Divider />
        {loading || comments.length ? (
          <InfiniteList
            style={{ overflow: "hidden" }}
            className={classes.scroller}
            dataLength={comments ? comments.length : 0}
            next={() =>
              fetchComments({ artworkId, query, highlightRef, enqueueSnackbar })
            }
            hasMore={scroll.hasMore}
            loading={loading}
            loader={<LoadingSpinner />}
            error={scroll.retry}
          >
            <List
              ref={commentsRef}
              p={0}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              disablePadding
            >
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
        ) : (
          <Box
            height={180}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={-2}
          >
            <EmptySection label="No comments so far" loading={loading} />
          </Box>
        )}
      </CardContent>
      <CommentPopover
        artworkId={artworkId}
        id={popover.id}
        anchorEl={popover.anchorEl}
        open={popover.open}
        handleCommentOpen={openComment}
        handleCommentDelete={deleteComment}
        handlePopoverClose={closePopover}
      />
    </Card>
  );
};

export default CommentSection;

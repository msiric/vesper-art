import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, CardContent, Divider } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import queryString from "query-string";
import React, { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router-dom";
import shallow from "zustand/shallow";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import CommentCard from "../../components/CommentCard/index.js";
import CommentPopover from "../../components/CommentPopover";
import EmptySection from "../../components/EmptySection/index.js";
import InfiniteList from "../../components/InfiniteList";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import { useCommentsStore } from "../../contexts/local/comments";
import AddCommentForm from "../../forms/CommentForm/index.js";
import { List, Typography } from "../../styles/theme.js";
import commentSectionStyles from "./styles.js";

const CommentSection = ({ commentsRef }) => {
  const { artworkId, artworkOwnerId } = useArtworkStore(
    (state) => ({
      artworkId: state.artwork.data.id,
      artworkOwnerId: state.artwork.data.owner.id,
    }),
    shallow
  );
  const {
    comments,
    loading,
    edits,
    popover,
    highlight,
    scroll,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    openComment,
    closeComment,
    openPopover,
    closePopover,
  } = useCommentsStore(
    (state) => ({
      comments: state.comments.data,
      loading: state.comments.loading,
      edits: state.edits,
      popover: state.popover,
      highlight: state.highlight,
      scroll: state.scroll,
      fetchComments: state.fetchComments,
      addComment: state.addComment,
      updateComment: state.updateComment,
      deleteComment: state.deleteComment,
      openComment: state.openComment,
      closeComment: state.closeComment,
      openPopover: state.openPopover,
      closePopover: state.closePopover,
    }),
    shallow
  );
  const [userStore] = useUserContext();

  const highlightRef = useRef(null);
  const location = useLocation();
  const history = useHistory();
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
                  id: userStore.id,
                  name: userStore.name,
                  avatar: userStore.avatar,
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
            next={() => fetchComments({ artworkId })}
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

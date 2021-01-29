import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, CardContent, Divider } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import queryString from "query-string";
import React, { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useLocation } from "react-router-dom";
import shallow from "zustand/shallow";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import CommentCard from "../../components/CommentCard/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import { useCommentsStore } from "../../contexts/local/comments";
import AddCommentForm from "../../forms/CommentForm/index.js";
import { List, Typography } from "../../styles/theme.js";
import commentSectionStyles from "./styles.js";

const CommentSection = ({}) => {
  const { artworkId } = useArtworkStore(
    (state) => ({
      artworkId: state.artwork.data.id,
    }),
    shallow
  );
  const {
    comments,
    loading,
    edits,
    highlight,
    scroll,
    fetchComments,
    addComment,
    updateComment,
    deleteComment,
    openComment,
    closeComment,
  } = useCommentsStore(
    (state) => ({
      comments: state.comments.data,
      loading: state.comments.loading,
      edits: state.edits,
      highlight: state.highlight,
      scroll: state.scroll,
      fetchComments: state.fetchComments,
      addComment: state.addComment,
      updateComment: state.updateComment,
      deleteComment: state.deleteComment,
      openComment: state.openComment,
      closeComment: state.closeComment,
    }),
    shallow
  );
  const [userStore] = useUserContext();

  const commentsRef = useRef(null);
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
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography my={2} fontSize="h5.fontSize">
            Comments
          </Typography>
        </SkeletonWrapper>
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
          <InfiniteScroll
            style={{ overflow: "hidden" }}
            className={classes.scroller}
            dataLength={comments ? comments.length : 0}
            next={fetchComments}
            hasMore={scroll.comments ? scroll.hasMore : null}
            loader={<LoadingSpinner />}
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
                    comment={highlight.element}
                    edits={edits}
                    queryRef={query ? query.ref : null}
                    highlightRef={highlightRef}
                    handleCommentClose={closeComment}
                    handleCommentEdit={updateComment}
                    handlePopoverOpen={() => null}
                    loading={loading}
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
                  handlePopoverOpen={() => null}
                  loading={loading}
                />
              )}
            </List>
          </InfiniteScroll>
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
    </Card>
  );
};

export default CommentSection;

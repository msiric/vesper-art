import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Card, CardContent, Divider } from "@material-ui/core";
import { AddCircleRounded as UploadIcon } from "@material-ui/icons";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";
import { commentValidation } from "../../../../common/validation";
import AsyncButton from "../../components/AsyncButton/index.js";
import CommentCard from "../../components/CommentCard/index.js";
import EmptySection from "../../components/EmptySection/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import AddCommentForm from "../../forms/CommentForm/index.js";
import { postComment } from "../../services/artwork.js";
import { List, Typography } from "../../styles/theme.js";
import commentSectionStyles from "./styles.js";

const CommentSection = ({
  commentsRef,
  artwork = {},
  edits = {},
  scroll = {},
  queryRef,
  highlight,
  highlightRef,
  loadMoreComments,
  handleCommentAdd,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const history = useHistory();
  const classes = commentSectionStyles();

  const { handleSubmit, formState, errors, control, reset } = useForm({
    defaultValues: {
      commentContent: "",
    },
    resolver: yupResolver(commentValidation),
  });

  const onSubmit = async (values) => {
    const { data } = await postComment.request({
      artworkId: artwork.id,
      data: values,
    });
    handleCommentAdd(data.payload);
    reset();
  };

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
              Post
            </AsyncButton>
          </form>
        </FormProvider>

        <br />
        <Divider />
        {loading || artwork.comments.length ? (
          <InfiniteScroll
            style={{ overflow: "hidden" }}
            className={classes.scroller}
            dataLength={artwork.comments ? artwork.comments.length : 0}
            next={loadMoreComments}
            hasMore={scroll.comments ? scroll.comments.hasMore : null}
            loader={<LoadingSpinner />}
          >
            <List
              ref={commentsRef}
              p={0}
              style={{ display: "flex", flexDirection: "column-reverse" }}
              disablePadding
            >
              <Box>
                {artwork.comments.map((comment) => (
                  <CommentCard
                    artwork={artwork}
                    comment={comment}
                    edits={edits}
                    queryRef={queryRef}
                    highlightRef={highlightRef}
                    handleCommentClose={handleCommentClose}
                    handleCommentEdit={handleCommentEdit}
                    handlePopoverOpen={handlePopoverOpen}
                    loading={loading}
                  />
                ))}
              </Box>
              {highlight.element && (
                <CommentCard
                  artwork={artwork}
                  comment={highlight.element}
                  edits={edits}
                  queryRef={queryRef}
                  highlightRef={highlightRef}
                  handleCommentClose={handleCommentClose}
                  handleCommentEdit={handleCommentEdit}
                  handlePopoverOpen={handlePopoverOpen}
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

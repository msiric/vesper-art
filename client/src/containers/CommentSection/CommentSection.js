import { Box, Card, CardContent, Divider } from "@material-ui/core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";
import CommentCard from "../../components/CommentCard/CommentCard.js";
import EmptySection from "../../components/EmptySection/EmptySection.js";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { List, Typography } from "../../styles/theme.js";
import AddCommentForm from "../Comment/AddCommentForm.js";

const CommentSection = ({
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
  const classes = {};

  return (
    <Card className={classes.root}>
      <CardContent>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography my={2} fontSize="h5.fontSize">
            Comments
          </Typography>
        </SkeletonWrapper>
        <Divider />
        <AddCommentForm
          artwork={artwork}
          handleCommentAdd={handleCommentAdd}
          loading={loading}
        />
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
              p={0}
              style={{ display: "flex", flexDirection: "column-reverse" }}
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

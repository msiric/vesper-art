import { Box, Card, CardContent, Divider } from "@material-ui/core";
import React, { useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory } from "react-router-dom";
import CommentCard from "../../components/CommentCard/CommentCard.js";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/SkeletonWrapper.js";
import { Context } from "../../context/Store.js";
import { List, Typography } from "../../styles/theme.js";
import AddCommentForm from "../Comment/AddCommentForm.js";

const CommentSection = ({
  artwork = {},
  edits = {},
  scroll = {},
  loadMoreComments,
  handleCommentAdd,
  handleCommentEdit,
  handleCommentClose,
  handlePopoverOpen,
  loading,
}) => {
  const [store, dispatch] = useContext(Context);
  const history = useHistory();
  const classes = {};

  return (
    <Card className={classes.root}>
      <CardContent>
        <SkeletonWrapper variant="text" loading={loading}>
          <Typography m={2} fontSize="h5.fontSize">
            Comments
          </Typography>
        </SkeletonWrapper>
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
            <List p={0}>
              {artwork.comments.map((comment) => (
                <CommentCard
                  artwork={artwork}
                  comment={comment}
                  edits={edits}
                  handleCommentClose={handleCommentClose}
                  handleCommentEdit={handleCommentEdit}
                  handlePopoverOpen={handlePopoverOpen}
                  loading={loading}
                />
              ))}
            </List>
          </InfiniteScroll>
        ) : (
          <Box
            height={80}
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={-2}
          >
            <SkeletonWrapper variant="text" loading={loading} width="100%">
              <Typography>No comments</Typography>
            </SkeletonWrapper>
          </Box>
        )}
        <AddCommentForm
          artwork={artwork}
          handleCommentAdd={handleCommentAdd}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
};

export default CommentSection;

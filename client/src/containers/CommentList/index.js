import { useSectionScroll } from "@hooks/useSectionScroll";
import { useSnackbar } from "notistack";
import queryString from "query-string";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import CommentCard from "../../components/CommentCard/index";
import InfiniteList from "../../components/InfiniteList";
import { useArtworkComments } from "../../contexts/local/artworkComments";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import List from "../../domain/List";
import { useVisibleElement } from "../../hooks/useVisibleElement";
import {
  determineFetchingState,
  determineLoadingState,
} from "../../utils/helpers";
import commentListStyles from "./styles";

const CommentList = ({
  artworkId,
  commentsRef,
  highlightRef,
  commentsFetched,
}) => {
  const artworkOwnerId = useArtworkDetails(
    (state) => state.artwork.data.owner.id
  );

  const comments = useArtworkComments((state) => state.comments.data);
  const limit = useArtworkComments((state) => state.comments.limit);
  const initialized = useArtworkComments((state) => state.comments.initialized);
  const loading = useArtworkComments((state) => state.comments.loading);
  const fetching = useArtworkComments((state) => state.comments.fetching);
  const error = useArtworkComments((state) => state.comments.error);
  const edits = useArtworkComments((state) => state.edits);
  const highlight = useArtworkComments((state) => state.highlight);
  const hasMore = useArtworkComments((state) => state.comments.hasMore);
  const fetchComments = useArtworkComments((state) => state.fetchComments);
  const updateComment = useArtworkComments((state) => state.updateComment);
  const closeComment = useArtworkComments((state) => state.closeComment);
  const openPopover = useArtworkComments((state) => state.openPopover);

  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const isVisible = useVisibleElement(commentsRef, commentsFetched.current);
  useSectionScroll();
  const query = queryString.parse(location.search);
  const classes = commentListStyles();

  useEffect(() => {
    if (
      ((!commentsFetched.current && isVisible) ||
        (!commentsFetched.current && query.notif === "comment" && query.ref)) &&
      !loading
    ) {
      fetchComments({
        artworkId,
        query,
        highlightRef,
        enqueueSnackbar,
      });
      commentsFetched.current = true;
    }
  }, [isVisible]);

  const renderComment = (comment, loading) => (
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
      loading={loading}
    />
  );

  return (
    <InfiniteList
      dataLength={comments ? comments.length : 0}
      next={() =>
        fetchComments({
          artworkId,
          query,
          highlightRef,
          enqueueSnackbar,
        })
      }
      hasMore={hasMore}
      loading={loading}
      fetching={fetching}
      initialized={initialized}
      error={error.refetch}
      label="No comments yet"
      type="list"
      loaderMargin="32px 0"
      emptyHeight={200}
    >
      <List
        id="comments"
        ref={commentsRef}
        className={classes.list}
        disablePadding
      >
        <Box>
          {determineLoadingState(loading, limit, comments).map((comment) =>
            renderComment(comment, loading)
          )}
          {determineFetchingState(fetching, limit).map((comment) =>
            renderComment(comment, fetching)
          )}
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
  );
};

export default CommentList;

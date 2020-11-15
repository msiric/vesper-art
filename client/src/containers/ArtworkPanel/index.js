import { Box } from "@material-ui/core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import artworkPanelStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const ArtworkPanel = ({
  elements,
  hasMore,
  loadMore,
  enqueueSnackbar,
  type,
  fixed,
  loading,
}) => {
  const classes = artworkPanelStyles();

  return (
    <Box style={{ width: "100%", height: "100%", padding: "16px 0" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className={classes.masonryContainer}
          columnClassName={classes.masonryColumn}
        >
          {elements.map((artwork) => (
            <ArtworkCard
              artwork={artwork}
              type={type}
              fixed={fixed}
              loading={loading}
            />
          ))}
        </Masonry>
      </InfiniteScroll>
    </Box>
  );
};

export default ArtworkPanel;

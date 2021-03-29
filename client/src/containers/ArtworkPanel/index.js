import { Box } from "@material-ui/core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import artworkPanelStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const ArtworkPanel = ({ type, fixed }) => {
  const elements = useHomeArtwork((state) => state.artwork.data);
  const hasMore = useHomeArtwork((state) => state.artwork.hasMore);
  const loading = useHomeArtwork((state) => state.artwork.loading);
  const fetchArtwork = useHomeArtwork((state) => state.fetchArtwork);

  const classes = artworkPanelStyles();

  return (
    <Box style={{ width: "100%", height: "100%", padding: "16px 0" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={fetchArtwork}
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

import React from "react";
import Masonry from "react-masonry-css";
import { breakpoints } from "../../common/constants";
import ArtworkCard from "../../components/ArtworkCard/index.js";
import InfiniteList from "../../components/InfiniteList/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import Box from "../../domain/Box";
import artworkPanelStyles from "./styles.js";

const ArtworkPanel = ({ type, fixed }) => {
  const elements = useHomeArtwork((state) => state.artwork.data);
  const hasMore = useHomeArtwork((state) => state.artwork.hasMore);
  const loading = useHomeArtwork((state) => state.artwork.loading);
  const error = useHomeArtwork((state) => state.artwork.error);
  const fetchArtwork = useHomeArtwork((state) => state.fetchArtwork);

  const classes = artworkPanelStyles();

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements ? elements.length : 0}
        next={fetchArtwork}
        hasMore={hasMore}
        loading={loading}
        loader={<LoadingSpinner />}
        error={error}
      >
        <Masonry
          breakpointCols={breakpoints}
          className={classes.masonry}
          columnClassName={classes.column}
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
      </InfiniteList>
    </Box>
  );
};

export default ArtworkPanel;

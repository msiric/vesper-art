import React from "react";
import Masonry from "react-masonry-css";
import { breakpointsFullWidth } from "../../common/constants";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import Box from "../../domain/Box";
import artworkPanelStyles from "./styles";

const ArtworkPanel = ({ type, fixed }) => {
  const elements = useHomeArtwork((state) => state.artwork.data);
  const initialized = useHomeArtwork((state) => state.artwork.initialized);
  const hasMore = useHomeArtwork((state) => state.artwork.hasMore);
  const loading = useHomeArtwork((state) => state.artwork.loading);
  const fetching = useHomeArtwork((state) => state.artwork.fetching);
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
        fetching={fetching}
        initialized={initialized}
        error={error.refetch}
        empty="No artwork found"
        type="masonry"
      >
        <Masonry
          breakpointCols={breakpointsFullWidth}
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

import { determineFetchingState, determineLoadingState } from "@utils/helpers";
import React from "react";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import { useHomeArtwork } from "../../contexts/local/homeArtwork";
import Box from "../../domain/Box";
import { breakpointsFullWidth } from "../../shared/constants";
import artworkPanelStyles from "./styles";

const ArtworkPanel = ({ type, fixed }) => {
  const elements = useHomeArtwork((state) => state.artwork.data);
  const initialized = useHomeArtwork((state) => state.artwork.initialized);
  const hasMore = useHomeArtwork((state) => state.artwork.hasMore);
  const loading = useHomeArtwork((state) => state.artwork.loading);
  const limit = useHomeArtwork((state) => state.artwork.limit);
  const fetching = useHomeArtwork((state) => state.artwork.fetching);
  const error = useHomeArtwork((state) => state.artwork.error);
  const fetchArtwork = useHomeArtwork((state) => state.fetchArtwork);

  const classes = artworkPanelStyles();

  const renderArtwork = (artwork, loading) => (
    <ArtworkCard
      artwork={artwork}
      type={type}
      fixed={fixed}
      loading={loading}
    />
  );

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
        label="No artwork found"
        type="masonry"
      >
        <Masonry
          breakpointCols={breakpointsFullWidth}
          className={classes.masonry}
          columnClassName={classes.column}
        >
          {determineLoadingState(loading, limit, elements).map((artwork) =>
            renderArtwork(artwork, loading)
          )}
          {determineFetchingState(fetching, limit).map((artwork) =>
            renderArtwork(artwork, fetching)
          )}
        </Masonry>
      </InfiniteList>
    </Box>
  );
};

export default ArtworkPanel;

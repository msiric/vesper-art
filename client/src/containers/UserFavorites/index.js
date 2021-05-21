import { Box } from "@material-ui/core";
import React from "react";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index.js";
import InfiniteList from "../../components/InfiniteList/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import userFavoritesStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const UserFavorites = ({ fixed }) => {
  const elements = useUserArtwork((state) => state.favorites.data);
  const hasMore = useUserArtwork((state) => state.favorites.hasMore);
  const loading = useUserArtwork((state) => state.favorites.loading);
  const error = useUserArtwork((state) => state.favorites.error);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);

  const classes = userFavoritesStyles();

  return (
    <Box style={{ width: "100%", height: "100%", padding: "16px 0" }}>
      <InfiniteList
        style={{ overflow: "hidden" }}
        className={classes.scroller}
        dataLength={elements ? elements.length : 0}
        next={fetchFavorites}
        hasMore={hasMore}
        loading={loading}
        loader={<LoadingSpinner />}
        error={error}
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className={classes.masonryContainer}
          columnClassName={classes.masonryColumn}
        >
          {elements.map((artwork) => (
            <ArtworkCard
              artwork={artwork}
              type="favorite"
              fixed={fixed}
              loading={loading}
            />
          ))}
        </Masonry>
      </InfiniteList>
    </Box>
  );
};

export default UserFavorites;

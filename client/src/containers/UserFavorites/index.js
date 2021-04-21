import { Box } from "@material-ui/core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import userFavoritesStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const UserFavorites = ({ type, fixed }) => {
  const elements = useUserArtwork((state) => state.favorites.data);
  const hasMore = useUserArtwork((state) => state.favorites.hasMore);
  const loading = useUserArtwork((state) => state.favorites.loading);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);

  const classes = userFavoritesStyles();

  return (
    <Box style={{ width: "100%", height: "100%", padding: "16px 0" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={elements.length}
        next={fetchFavorites}
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
              type="favorite"
              fixed={fixed}
              loading={loading}
            />
          ))}
        </Masonry>
      </InfiniteScroll>
    </Box>
  );
};

export default UserFavorites;

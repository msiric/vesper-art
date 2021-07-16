import React from "react";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import Box from "../../domain/Box";
import userFavoritesStyles from "./styles";

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
  const fetching = useUserArtwork((state) => state.favorites.fetching);
  const error = useUserArtwork((state) => state.favorites.error);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);

  const classes = userFavoritesStyles();

  return (
    <Box>
      <InfiniteList
        dataLength={elements ? elements.length : 0}
        next={fetchFavorites}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        error={error.refetch}
        empty="No favorites yet"
        type="masonry"
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className={classes.masonry}
          columnClassName={classes.column}
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

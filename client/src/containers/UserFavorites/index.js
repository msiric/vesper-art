import { determineLoadingState } from "@utils/helpers";
import React from "react";
import Masonry from "react-masonry-css";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import Box from "../../domain/Box";
import { breakpointsFixedWidth } from "../../shared/constants";
import userFavoritesStyles from "./styles";

const UserFavorites = ({ userUsername, shouldPause, type, fixed }) => {
  const elements = useUserArtwork((state) => state.favorites.data);
  const initialized = useUserArtwork((state) => state.favorites.initialized);
  const hasMore = useUserArtwork((state) => state.favorites.hasMore);
  const loading = useUserArtwork((state) => state.favorites.loading);
  const limit = useUserArtwork((state) => state.favorites.limit);
  const fetching = useUserArtwork((state) => state.favorites.fetching);
  const error = useUserArtwork((state) => state.favorites.error);
  const fetchFavorites = useUserArtwork((state) => state.fetchFavorites);

  const classes = userFavoritesStyles();

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements ? elements.length : 0}
        next={() => fetchFavorites({ userUsername })}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        initialized={initialized}
        shouldPause={shouldPause}
        error={error.refetch}
        label="No favorites yet"
        type="masonry"
      >
        <Masonry
          breakpointCols={breakpointsFixedWidth}
          className={classes.masonry}
          columnClassName={classes.column}
        >
          {determineLoadingState(loading, limit, elements).map((artwork) => (
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

export default UserFavorites;

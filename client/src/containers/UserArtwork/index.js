import React from "react";
import Masonry from "react-masonry-css";
import { breakpointsFixedWidth } from "../../common/constants";
import ArtworkCard from "../../components/ArtworkCard/index";
import InfiniteList from "../../components/InfiniteList/index";
import { useUserArtwork } from "../../contexts/local/userArtwork";
import { useUserProfile } from "../../contexts/local/userProfile";
import Box from "../../domain/Box";
import userArtworkStyles from "./styles";

const UserArtwork = ({ userUsername, type, fixed }) => {
  const loading = useUserProfile((state) => state.profile.loading);

  const elements = useUserArtwork((state) => state.artwork.data);
  const hasMore = useUserArtwork((state) => state.artwork.hasMore);
  const fetching = useUserArtwork((state) => state.artwork.fetching);
  const error = useUserArtwork((state) => state.artwork.error);
  const fetchArtwork = useUserArtwork((state) => state.fetchArtwork);

  const classes = userArtworkStyles();

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements ? elements.length : 0}
        next={() => fetchArtwork({ userUsername })}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        error={error.refetch}
        empty="No artwork yet"
        type="masonry"
      >
        <Masonry
          breakpointCols={breakpointsFixedWidth}
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

export default UserArtwork;

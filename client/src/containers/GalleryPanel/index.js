import { determineFetchingState, determineLoadingState } from "@utils/helpers";
import React from "react";
import Masonry from "react-masonry-css";
import { useHistory } from "react-router-dom";
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox";
import ImageWrapper from "../../components/ImageWrapper/index";
import InfiniteList from "../../components/InfiniteList";
import { useUserStore } from "../../contexts/global/user";
import { useUserGallery } from "../../contexts/local/userGallery";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import { breakpointsFixedWidth } from "../../shared/constants";
import { artepunktTheme } from "../../styles/theme";
import galleryPanelStyles from "./styles";

const GalleryPanel = ({ formatArtwork }) => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);

  const display = useUserGallery((state) => state.display);
  const loading = useUserGallery((state) => state[display].loading);
  const fetching = useUserGallery((state) => state[display].fetching);
  const initialized = useUserGallery((state) => state[display].initialized);
  const limit = useUserGallery((state) => state[display].limit);
  const hasMore = useUserGallery((state) => state[display].hasMore);
  const error = useUserGallery((state) => state[display].error);
  const elements = useUserGallery((state) => state.elements);

  const fetchUser = useUserGallery((state) => state.fetchUser);
  const loadArtwork = useUserGallery((state) => state.loadArtwork);

  const history = useHistory();

  const classes = galleryPanelStyles({ loading });

  const options = {
    buttons: {
      showDownloadButton: false,
    },
    settings: {
      autoplaySpeed: 30000,
      hideControlsAfter: 3000,
      lightboxTransitionSpeed: 0.3,
      overlayColor: "rgba(0, 0, 0, 0.99)",
      slideAnimationType: "slide",
      slideSpringValues: [30, 10],
      slideTransitionTimingFunction: "easeInOut",
    },
    thumbnails: {
      showThumbnails: false,
    },
    progressBar: {
      backgroundColor: "#000000",
      fillColor: artepunktTheme.palette.primary.main,
    },
  };

  const isBlocked = loading || elements.some((element) => !element.loaded);

  const renderArtwork = (artwork, loading) => (
    <Card className={classes.card} key={artwork.id}>
      <ImageWrapper
        height={artwork.height}
        source={artwork.media}
        placeholder={artwork.dominant}
        caption={artwork.caption}
        shouldCover
        isBlocked={isBlocked}
        loading={loading}
        callbackFn={loadArtwork}
      />
    </Card>
  );

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements.length}
        next={() => fetchUser({ userId, userUsername, formatArtwork })}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        initialized={initialized}
        error={error.refetch}
        label="No artwork in your gallery"
        type="masonry"
        emptyHeight={360}
        childrenCount={limit}
      >
        <SimpleReactLightbox>
          <SRLWrapper options={options}>
            <Masonry
              breakpointCols={breakpointsFixedWidth}
              className={classes.masonry}
              columnClassName={`${classes.column} ${
                !isBlocked && classes.columnHover
              }`}
            >
              {determineLoadingState(loading, limit, elements).map((artwork) =>
                renderArtwork(artwork, loading || fetching)
              )}
              {determineFetchingState(fetching, limit).map((artwork) =>
                renderArtwork(artwork, fetching)
              )}
            </Masonry>
          </SRLWrapper>
        </SimpleReactLightbox>
      </InfiniteList>
    </Box>
  );
};

export default GalleryPanel;

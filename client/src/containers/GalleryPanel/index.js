import { Box, Card } from "@material-ui/core";
import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import { useHistory } from "react-router-dom";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import EmptySection from "../../components/EmptySection/index.js";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import InfiniteList from "../../components/InfiniteList";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import SkeletonWrapper from "../../components/SkeletonWrapper/index.js";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserGallery } from "../../contexts/local/userGallery";
import globalStyles from "../../styles/global.js";
import { artepunktTheme } from "../../styles/theme.js";
import galleryPanelStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GalleryPanel = ({ formatArtwork }) => {
  const userId = useUserStore((state) => state.id);
  const userUsername = useUserStore((state) => state.name);

  const display = useUserGallery((state) => state.display);
  const loading = useUserGallery((state) => state[display].loading);
  const hasMore = useUserGallery((state) => state[display].hasMore);
  const error = useUserGallery((state) => state[display].error);
  const selection = useUserGallery((state) => state[display]);
  const index = useUserGallery((state) => state.index);
  const media = useUserGallery((state) => state.media);
  const covers = useUserGallery((state) => state.covers);
  const fetching = useUserGallery((state) => state.fetching);
  const captions = useUserGallery((state) => state.captions);
  const fetchUser = useUserGallery((state) => state.fetchUser);
  const toggleGallery = useUserGallery((state) => state.toggleGallery);

  const history = useHistory();

  const globalClasses = globalStyles();
  const classes = galleryPanelStyles();

  const { openLightbox } = useLightbox();

  const callbacks = {
    onSlideChange: (slide) =>
      toggleGallery({
        userId,
        item: {
          cover: slide.slides.current.thumbnail,
          media: slide.slides.current.source,
        },
        index: slide.index,
        openLightbox,
        formatArtwork,
      }),
  };

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

  useEffect(() => {
    if (index !== null) {
      openLightbox(index);
    }
  }, [selection]);

  return (
    <Box style={{ height: "100%" }}>
      <SkeletonWrapper loading={loading} width="100%" height="100%">
        {covers.length ? (
          <InfiniteList
            className={classes.scroller}
            dataLength={covers.length}
            next={() => fetchUser({ userId, userUsername, formatArtwork })}
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
              {covers.map((item, idx) => (
                <Card
                  className={classes.artworkWrapper}
                  onClick={() =>
                    toggleGallery({
                      userId,
                      item,
                      index: idx,
                      openLightbox,
                      formatArtwork,
                    })
                  }
                >
                  {
                    <ImageWrapper
                      height={item.height}
                      width={item.width}
                      source={item.media ? item.media : item.cover}
                      cover={item.cover}
                      placeholder={item.dominant}
                      loading={idx === index && loading ? true : false}
                    />
                  }
                </Card>
              ))}
            </Masonry>
          </InfiniteList>
        ) : (
          <EmptySection
            label={
              display === "purchases"
                ? "You have no purchased artwork"
                : "You have no published artwork"
            }
          />
        )}
      </SkeletonWrapper>
      {!fetching && !loading && (
        <SRLWrapper
          images={media}
          callbacks={callbacks}
          options={options}
          customCaptions={captions}
        ></SRLWrapper>
      )}
    </Box>
  );
};

export default GalleryPanel;

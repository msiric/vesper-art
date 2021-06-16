import React, { useEffect } from "react";
import Masonry from "react-masonry-css";
import { useHistory } from "react-router-dom";
import { SRLWrapper, useLightbox } from "simple-react-lightbox";
import EmptySection from "../../components/EmptySection/index.js";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import InfiniteList from "../../components/InfiniteList";
import { useUserStore } from "../../contexts/global/user.js";
import { useUserGallery } from "../../contexts/local/userGallery";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
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
  const fetching = useUserGallery((state) => state[display].fetching);
  const hasMore = useUserGallery((state) => state[display].hasMore);
  const error = useUserGallery((state) => state[display].error);
  const selection = useUserGallery((state) => state[display]);
  const index = useUserGallery((state) => state.index);
  const media = useUserGallery((state) => state.media);
  const covers = useUserGallery((state) => state.covers);
  const isDownloading = useUserGallery((state) => state.isDownloading);
  const captions = useUserGallery((state) => state.captions);
  const fetchUser = useUserGallery((state) => state.fetchUser);
  const toggleGallery = useUserGallery((state) => state.toggleGallery);

  const history = useHistory();

  const globalClasses = globalStyles({ isDownloading });
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
    <Box>
      {loading || covers.length ? (
        <InfiniteList
          dataLength={covers.length}
          next={() => fetchUser({ userId, userUsername, formatArtwork })}
          hasMore={hasMore}
          loading={loading || fetching}
          error={error.refetch}
          empty="No artwork in your gallery"
        >
          <Masonry
            breakpointCols={breakpointColumns}
            className={classes.masonry}
            columnClassName={classes.column}
          >
            {covers.map((item, idx) => (
              <Card
                className={classes.card}
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
                    source={item.media ? item.media : item.cover}
                    cover={item.cover}
                    placeholder={item.dominant}
                    loading={idx === index && isDownloading ? true : false}
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
      {!isDownloading && !loading && (
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

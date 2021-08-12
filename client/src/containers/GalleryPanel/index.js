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
import { artepunktTheme } from "../../styles/theme";
import galleryPanelStyles from "./styles";

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
  const elements = useUserGallery((state) => state.elements);
  const captions = useUserGallery((state) => state.captions);
  const fetchUser = useUserGallery((state) => state.fetchUser);

  const history = useHistory();

  const classes = galleryPanelStyles();

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

  return (
    <Box className={classes.container}>
      <InfiniteList
        dataLength={elements.length}
        next={() => fetchUser({ userId, userUsername, formatArtwork })}
        hasMore={hasMore}
        loading={loading}
        fetching={fetching}
        error={error.refetch}
        empty="No artwork in your gallery"
        customPadding={true}
        type="masonry"
      >
        {!loading && !fetching ? (
          <SimpleReactLightbox>
            <SRLWrapper options={options} customCaptions={captions}>
              <Masonry
                breakpointCols={breakpointColumns}
                className={classes.masonry}
                columnClassName={classes.column}
              >
                {elements.map((item) => (
                  <Card className={classes.card} key={item.id}>
                    <ImageWrapper
                      height={item.height}
                      source={item.media}
                      placeholder={item.dominant}
                      loading={loading}
                    />
                  </Card>
                ))}
              </Masonry>
            </SRLWrapper>
          </SimpleReactLightbox>
        ) : null}
      </InfiniteList>
    </Box>
  );
};

export default GalleryPanel;

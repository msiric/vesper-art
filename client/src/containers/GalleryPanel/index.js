import { Box, Card } from "@material-ui/core";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";
import ImageWrapper from "../../components/ImageWrapper/index.js";
import LoadingSpinner from "../../components/LoadingSpinner/index.js";
import galleryPanelStyles from "./styles.js";

const breakpointColumns = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1,
};

const GalleryPanel = ({
  artwork,
  loadMore,
  hasMore,
  handleGalleryToggle,
  loading,
}) => {
  const classes = galleryPanelStyles();

  return (
    <Box style={{ width: "100%", padding: "16px 0" }}>
      <InfiniteScroll
        className={classes.scroller}
        dataLength={artwork.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<LoadingSpinner />}
      >
        <Masonry
          breakpointCols={breakpointColumns}
          className={classes.masonryContainer}
          columnClassName={classes.masonryColumn}
        >
          {artwork.map((item) => (
            <Card
              className={classes.artworkWrapper}
              onClick={() => handleGalleryToggle(item.cover)}
            >
              <ImageWrapper
                height={item.height}
                width={item.width}
                source={item.cover}
                placeholder={item.dominant}
                loading={loading}
              />
            </Card>
          ))}
        </Masonry>
      </InfiniteScroll>
    </Box>
  );
};

export default GalleryPanel;

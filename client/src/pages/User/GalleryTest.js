import { Box, Card, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useLocation } from "react-router-dom";
import { hexToRgb } from "../../../../common/helpers.js";
import GalleryPanel from "../../containers/GalleryPanel/index.js";
import GalleryToolbar from "../../containers/GalleryToolbar/index.js";
import globalStyles from "../../styles/global.js";

const Gallery = () => {
  const globalClasses = globalStyles();

  const location = useLocation();

  const formatArtwork = (artwork) => {
    const artworkIds = {};
    const uniqueCovers = [];
    const uniqueMedia = [];
    const uniqueCaptions = [];
    for (let item in artwork) {
      if (!artworkIds[artwork[item].cover]) {
        const { r, g, b } = hexToRgb(artwork[item].dominant);
        uniqueCovers.push({
          id: item,
          cover: artwork[item].cover,
          media: artwork[item].media,
          height: artwork[item].height,
          width: artwork[item].width,
          attributes: {
            boxShadow: `0px 0px 60px 35px rgba(${r},${g},${b},0.75)`,
            borderRadius: 4,
          },
          dominant: artwork[item].dominant,
        });
        uniqueMedia.push({
          src: artwork[item].media ? artwork[item].media : artwork[item].cover,
          thumbnail: artwork[item].cover,
          height: artwork[item].height,
          width: artwork[item].width,
        });
        uniqueCaptions.push({
          id: uniqueCaptions.length,
          caption: (
            <Box
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography style={{ fontWeight: "bold" }}>
                {artwork[item].title}
              </Typography>
              <Typography>{`\xa0by ${artwork[item].owner}`}</Typography>
            </Box>
          ),
        });
        artworkIds[artwork[item].cover] = true;
      }
    }
    return {
      covers: uniqueCovers,
      media: uniqueMedia,
      captions: uniqueCaptions,
    };
  };

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Card
          style={{
            width: "100%",
            minHeight: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <GalleryToolbar formatArtwork={formatArtwork} />
          <GalleryPanel formatArtwork={formatArtwork} />
        </Card>
      </Grid>
    </Container>
  );
};

export default Gallery;

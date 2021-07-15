import { makeStyles } from "@material-ui/core";
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { hexToRgb } from "../../../../common/helpers";
import GalleryPanel from "../../containers/GalleryPanel/index";
import GalleryToolbar from "../../containers/GalleryToolbar/index";
import { useUserGallery } from "../../contexts/local/userGallery";
import Box from "../../domain/Box";
import Card from "../../domain/Card";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import Typography from "../../domain/Typography";
import globalStyles from "../../styles/global";
import { renderUserData } from "../../utils/helpers";

const useGalleryStyles = makeStyles((muiTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
  },
  card: {
    width: "100%",
    minHeight: "500px",
    display: "flex",
    flexDirection: "column",
    padding: 24,
  },
}));

const Gallery = () => {
  const resetGallery = useUserGallery((state) => state.resetGallery);

  const globalClasses = globalStyles();
  const classes = useGalleryStyles();

  const location = useLocation();

  const formatArtwork = (artwork) => {
    const artworkIds = {};
    const uniqueElements = [];
    const uniqueCaptions = [];
    for (let item in artwork) {
      if (!artworkIds[artwork[item].cover]) {
        const { r, g, b } = hexToRgb(artwork[item].dominant);
        uniqueElements.push({
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
        uniqueCaptions.push({
          id: uniqueCaptions.length,
          caption: (
            <Box className={classes.wrapper}>
              <Typography className={classes.title}>
                {artwork[item].title}
              </Typography>
              <Typography>{`\xa0by ${renderUserData({
                data: artwork[item].owner,
                isUsername: true,
              })}`}</Typography>
            </Box>
          ),
        });
        artworkIds[artwork[item].cover] = true;
      }
    }
    return {
      elements: uniqueElements,
      captions: uniqueCaptions,
    };
  };

  const reinitializeState = () => {
    resetGallery();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container>
        <Card className={classes.card}>
          <GalleryToolbar formatArtwork={formatArtwork} />
          <GalleryPanel formatArtwork={formatArtwork} />
        </Card>
      </Grid>
    </Container>
  );
};

export default Gallery;

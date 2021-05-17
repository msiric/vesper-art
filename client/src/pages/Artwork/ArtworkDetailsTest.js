import { Box, Container, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef } from "react";
import ArtistSection from "../../containers/ArtistSection/index.js";
import ArtworkActions from "../../containers/ArtworkActions/index.js";
import ArtworkInfo from "../../containers/ArtworkInfo/index.js";
import ArtworkPreview from "../../containers/ArtworkPreview/index.js";
import CommentSection from "../../containers/CommentSection/index.js";
import { useArtworkComments } from "../../contexts/local/artworkComments";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import { useArtworkFavorites as useFavoritesStore } from "../../contexts/local/artworkFavorites";
import globalStyles from "../../styles/global.js";

const useArtworkStyles = makeStyles((muiTheme) => ({
  responsiveWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "100%",
    [muiTheme.breakpoints.down("sm")]: {
      position: "static",
    },
  },
  responsiveContainer: {
    position: "sticky",
    top: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    [muiTheme.breakpoints.down("sm")]: {
      position: "static",
      flexDirection: "row",
    },
    [muiTheme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  spacingContainer: {
    position: "relative",
  },
  orderContainerMd: {
    display: "flex",
    [muiTheme.breakpoints.down("xs")]: {
      display: "none",
    },
    [muiTheme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  previewSection: {
    display: "flex",
    height: "100%",
  },
  userSection: {
    [muiTheme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
  actionSection: {
    [muiTheme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
}));

const ArtworkDetails = ({ match, location }) => {
  const resetArtwork = useArtworkDetails((state) => state.resetArtwork);
  const resetFavorites = useFavoritesStore((state) => state.resetFavorites);
  const resetComments = useArtworkComments((state) => state.resetComments);
  const paramId = match.params.id;
  const commentsFetched = useRef(false);
  const commentsRef = useRef(null);
  const highlightRef = useRef(null);

  const globalClasses = globalStyles();
  const classes = useArtworkStyles();

  const reinitializeState = () => {
    commentsFetched.current = false;
    commentsRef.current = null;
    highlightRef.current = null;
    resetArtwork();
    resetFavorites();
    resetComments();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2} className={classes.spacingContainer}>
        <Grid item sm={12} md={8}>
          <Box className={classes.previewSection}>
            <ArtworkPreview paramId={paramId} />
          </Box>
        </Grid>
        <Grid item sm={12} md={4} className={classes.responsiveWrapper}>
          <Box className={classes.responsiveContainer}>
            <Box
              className={`${classes.userSection} ${globalClasses.responsiveSpacing}`}
            >
              <ArtistSection />
            </Box>
            <Box className={classes.actionSection}>
              <Box className={globalClasses.bottomSpacing}>
                <ArtworkActions paramId={paramId} />
              </Box>
              <Box>
                <ArtworkInfo />
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box>
            <CommentSection
              paramId={paramId}
              highlightRef={highlightRef}
              commentsRef={commentsRef}
              commentsFetched={commentsFetched}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArtworkDetails;

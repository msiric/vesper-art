import { makeStyles } from "@material-ui/core/styles";
import React, { useEffect, useRef } from "react";
import ArtistSection from "../../containers/ArtistSection/index";
import ArtworkActions from "../../containers/ArtworkActions/index";
import ArtworkInfo from "../../containers/ArtworkInfo/index";
import ArtworkPreview from "../../containers/ArtworkPreview/index";
import CommentSection from "../../containers/CommentSection/index";
import { useArtworkComments } from "../../contexts/local/artworkComments";
import { useArtworkDetails } from "../../contexts/local/artworkDetails";
import Box from "../../domain/Box";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const useArtworkStyles = makeStyles((muiTheme) => ({
  container: {
    position: "relative",
  },
  stickyWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    height: "100%",
    width: "100%",
    [muiTheme.breakpoints.down("sm")]: {
      position: "static",
    },
  },
  infoWrapper: {
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
  item: {
    width: "100%",
  },
  previewWrapper: {
    display: "flex",
    height: "100%",
  },
  ownerWrapper: {
    [muiTheme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
  actions: {
    [muiTheme.breakpoints.down("sm")]: {
      flex: 1,
    },
  },
}));

const ArtworkDetails = ({ match }) => {
  const retry = useArtworkDetails((state) => state.artwork.error.retry);
  const redirect = useArtworkDetails((state) => state.artwork.error.redirect);
  const message = useArtworkDetails((state) => state.artwork.error.message);
  const resetArtwork = useArtworkDetails((state) => state.resetArtwork);
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
    resetComments();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2} className={classes.container}>
        <Grid item sm={12} md={8} className={classes.item}>
          <Box className={classes.previewWrapper}>
            <ArtworkPreview paramId={paramId} />
          </Box>
        </Grid>
        <Grid item sm={12} md={4} className={classes.stickyWrapper}>
          <Box className={classes.infoWrapper}>
            <Box
              className={`${classes.ownerWrapper} ${globalClasses.responsiveSpacing}`}
            >
              <ArtistSection />
            </Box>
            <Box className={classes.actions}>
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
              artworkId={paramId}
              highlightRef={highlightRef}
              commentsRef={commentsRef}
              commentsFetched={commentsFetched}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  ) : (
    renderError({ retry, redirect, message, reinitializeState })
  );
};

export default ArtworkDetails;

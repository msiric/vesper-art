import { Container, Grid } from "@material-ui/core";
import React, { useEffect, useRef } from "react";
import ArtistSection from "../../containers/ArtistSection/index.js";
import ArtworkActions from "../../containers/ArtworkActions/index.js";
import ArtworkInfo from "../../containers/ArtworkInfo/index.js";
import ArtworkPreview from "../../containers/ArtworkPreview/index.js";
import CommentSection from "../../containers/CommentSection/index.js";
import { useArtworkStore } from "../../contexts/local/artwork";
import { useCommentsStore } from "../../contexts/local/comments";
import { useFavoritesStore } from "../../contexts/local/favorites";
import globalStyles from "../../styles/global.js";

const ArtworkDetails = ({ match, location }) => {
  const resetArtwork = useArtworkStore((state) => state.resetArtwork);
  const resetFavorites = useFavoritesStore((state) => state.resetFavorites);
  const resetComments = useCommentsStore((state) => state.resetComments);
  const paramId = match.params.id;
  const commentsFetched = useRef(false);
  const commentsRef = useRef(null);
  const highlightRef = useRef(null);
  const globalClasses = globalStyles();

  const reinitializeState = () => {
    commentsFetched.current = false;
    commentsRef.current = null;
    highlightRef.current = null;
    resetArtwork();
    resetFavorites();
    resetComments();
  };

  useEffect(() => {
    return function cleanup() {
      reinitializeState();
    };
  }, [location]);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12} md={8}>
          <ArtworkPreview paramId={paramId} />
          <br />
          <CommentSection
            paramId={paramId}
            commentsRef={commentsRef}
            highlightRef={highlightRef}
            commentsFetched={commentsFetched}
          />
        </Grid>
        <Grid item sm={12} md={4}>
          <ArtistSection />
          <br />
          <ArtworkActions paramId={paramId} />
          <br />
          <ArtworkInfo />
        </Grid>
      </Grid>
    </Container>
  );
};

export default ArtworkDetails;

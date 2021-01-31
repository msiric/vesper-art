import { Container, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import queryString from "query-string";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import EmptySection from "../../components/EmptySection/index.js";
import ArtistSection from "../../containers/ArtistSection/index.js";
import ArtworkActions from "../../containers/ArtworkActions/index.js";
import ArtworkInfo from "../../containers/ArtworkInfo/index.js";
import ArtworkPreview from "../../containers/ArtworkPreview/index.js";
import CommentSection from "../../containers/CommentSection/index.js";
import { useTracked as useUserContext } from "../../contexts/global/User.js";
import { useArtworkStore } from "../../contexts/local/Artwork";
import { useCommentsStore } from "../../contexts/local/comments";
import { useFavoritesStore } from "../../contexts/local/favorites";
import useOnScreen from "../../hooks/useOnScreen";
import globalStyles from "../../styles/global.js";

const artworkSelector = (state) => ({
  artworkId: state.artwork.data.id,
  loading: state.artwork.loading,
  fetchArtwork: state.fetchArtwork,
  resetArtwork: state.resetArtwork,
});

const favoritesSelector = (state) => ({
  fetchFavorites: state.fetchFavorites,
  resetFavorites: state.resetFavorites,
});

const commentsSelector = (state) => ({
  fetchComments: state.fetchComments,
  resetComments: state.resetComments,
});

const ArtworkDetails = ({ match, location, socket }) => {
  const { artworkId, loading, fetchArtwork, resetArtwork } = useArtworkStore(
    artworkSelector
  );
  const { fetchFavorites, resetFavorites } = useFavoritesStore(
    favoritesSelector
  );
  const { fetchComments, resetComments } = useCommentsStore(commentsSelector);
  const [userStore] = useUserContext();
  const paramId = match.params.id;
  const commentsFetched = useRef(false);
  const commentsRef = useRef(null);
  const highlightRef = useRef(null);
  const isVisible = useOnScreen(commentsRef);
  const history = useHistory();
  const globalClasses = globalStyles();
  const { enqueueSnackbar } = useSnackbar();

  const query = queryString.parse(location.search);

  const reinitializeState = () => {
    commentsFetched.current = false;
    commentsRef.current = null;
    highlightRef.current = null;
    resetArtwork();
    resetFavorites();
    resetComments();
  };

  useEffect(() => {
    Promise.all([
      fetchArtwork({ artworkId: paramId }),
      fetchFavorites({ artworkId: paramId }),
    ]);
    return function cleanup() {
      reinitializeState();
    };
  }, [location]);

  useEffect(() => {
    if (
      (!commentsFetched.current && isVisible) ||
      (!commentsFetched.current && query.notif === "comment" && query.ref)
    ) {
      fetchComments({
        artworkId: paramId,
        query,
        highlightRef,
        enqueueSnackbar,
      });
      commentsFetched.current = true;
    }
  }, [isVisible, location]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {loading || artworkId ? (
          <>
            <Grid item sm={12} md={8}>
              <ArtworkPreview />
              <br />
              <CommentSection
                commentsRef={commentsRef}
                highlightRef={highlightRef}
                query={query}
              />
            </Grid>
            <Grid item sm={12} md={4}>
              <ArtistSection />
              <br />
              <ArtworkActions />
              <br />
              <ArtworkInfo />
            </Grid>
          </>
        ) : (
          <EmptySection label="Artwork not found" page />
        )}
      </Grid>
    </Container>
  );
};

export default ArtworkDetails;

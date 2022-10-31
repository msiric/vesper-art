import { useUserStore } from "@contexts/global/user";
import { makeStyles } from "@material-ui/core";
import { DeleteOutlineRounded as DeleteIcon } from "@material-ui/icons";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/index";
import PromptModal from "../../components/PromptModal/index";
import ArtworkModifier from "../../containers/ArtworkModifier";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import globalStyles from "../../styles/global";
import { containsErrors, renderError } from "../../utils/helpers";

const useEditorStyles = makeStyles((muiTheme) => ({
  wrapper: {
    height: "100%",
    width: "100%",
  },
}));

const EditArtwork = ({ match }) => {
  const userId = useUserStore((state) => state.id);

  const artworkRetry = useArtworkUpdate((state) => state.artwork.error.retry);
  const artworkRedirect = useArtworkUpdate(
    (state) => state.artwork.error.redirect
  );
  const artworkMessage = useArtworkUpdate(
    (state) => state.artwork.error.message
  );
  const requirementsRetry = useArtworkUpdate(
    (state) => state.requirements.error.retry
  );
  const requirementsRedirect = useArtworkUpdate(
    (state) => state.requirements.error.redirect
  );
  const requirementsMessage = useArtworkUpdate(
    (state) => state.requirements.error.message
  );
  const artwork = useArtworkUpdate((state) => state.artwork.data);
  const artworkLoading = useArtworkUpdate((state) => state.artwork.loading);
  const requirementsLoading = useArtworkUpdate(
    (state) => state.requirements.loading
  );
  const modal = useArtworkUpdate((state) => state.modal);
  const isDeleting = useArtworkUpdate((state) => state.isDeleting);
  const removeArtwork = useArtworkUpdate((state) => state.removeArtwork);
  const toggleModal = useArtworkUpdate((state) => state.toggleModal);
  const resetArtwork = useArtworkUpdate((state) => state.resetArtwork);

  const paramId = match.params.id;

  const history = useHistory();

  const globalClasses = globalStyles();
  const classes = useEditorStyles();

  const handleDeleteArtwork = async () => {
    await removeArtwork({ userId, artworkId: artwork.id });
    history.push("/");
  };

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(
    artworkRetry,
    artworkRedirect,
    requirementsRetry,
    requirementsRedirect
  ) ? (
    <Container className={globalClasses.gridContainer}>
      {artworkLoading || requirementsLoading || artwork.id ? (
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.wrapper}>
            <MainHeading text="Edit artwork" />
            <ArtworkModifier paramId={paramId} />
          </Grid>
        </Grid>
      ) : (
        // $TODO push to home and display error notification
        "Ne postoji"
      )}
      <PromptModal
        open={modal.open}
        handleConfirm={handleDeleteArtwork}
        handleClose={toggleModal}
        ariaLabel="Delete artwork"
        promptTitle="Are you sure you want to delete this artwork?"
        promptConfirm="Delete"
        promptCancel="Cancel"
        isSubmitting={isDeleting}
        startIcon={<DeleteIcon />}
      />
    </Container>
  ) : (
    renderError(
      {
        retry: artworkRetry,
        redirect: artworkRedirect,
        message: artworkMessage,
      },
      {
        retry: requirementsRetry,
        redirect: requirementsRedirect,
        message: requirementsMessage,
      }
    )
  );
};

export default EditArtwork;

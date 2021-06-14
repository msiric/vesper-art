import { makeStyles } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import ArtworkModifier from "../../containers/ArtworkModifier";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import { deleteArtwork } from "../../services/artwork.js";
import globalStyles from "../../styles/global.js";

const useEditorStyles = makeStyles((muiTheme) => ({
  wrapper: {
    height: "100%",
  },
}));

const EditArtwork = ({ match }) => {
  const artwork = useArtworkUpdate((state) => state.artwork.data);
  const artworkLoading = useArtworkUpdate((state) => state.artwork.loading);
  const capabilitiesLoading = useArtworkUpdate(
    (state) => state.capabilities.loading
  );
  const modal = useArtworkUpdate((state) => state.modal);
  const isDeleting = useArtworkUpdate((state) => state.isDeleting);
  const removeArtwork = useArtworkUpdate((state) => state.removeArtwork);
  const toggleModal = useArtworkUpdate((state) => state.toggleModal);
  const resetArtwork = useArtworkUpdate((state) => state.resetArtwork);

  const paramId = match.params.id;

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const globalClasses = globalStyles();
  const classes = useEditorStyles();

  const handleDeleteArtwork = async () => {
    await removeArtwork({ artworkId: artwork.id });
    history.push("/");
    enqueueSnackbar(deleteArtwork.success.message, {
      variant: deleteArtwork.success.variant,
    });
  };

  const reinitializeState = () => {
    resetArtwork();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {artworkLoading || capabilitiesLoading || artwork.id ? (
          <Grid item sm={12} className={classes.wrapper}>
            <MainHeading
              text="Edit artwork"
              className={globalClasses.mainHeading}
            />
            <ArtworkModifier paramId={paramId} />
          </Grid>
        ) : (
          // $TODO push to home and display error notification
          "Ne postoji"
        )}
      </Grid>
      <PromptModal
        open={modal.open}
        handleConfirm={handleDeleteArtwork}
        handleClose={toggleModal}
        ariaLabel="Delete artwork"
        promptTitle="Are you sure you want to delete this artwork?"
        promptConfirm="Delete"
        promptCancel="Cancel"
        isSubmitting={isDeleting}
      />
    </Container>
  );
};

export default EditArtwork;

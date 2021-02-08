import { Container, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/index.js";
import PromptModal from "../../components/PromptModal/index.js";
import ArtworkModifier from "../../containers/ArtworkModifier";
import { useArtworkUpdate } from "../../contexts/local/artworkUpdate";
import globalStyles from "../../styles/global.js";

const EditArtwork = ({ location, match }) => {
  const artwork = useArtworkUpdate((state) => state.artwork.data);
  const artworkLoading = useArtworkUpdate((state) => state.artwork.loading);
  const capabilitiesLoading = useArtworkUpdate(
    (state) => state.capabilities.loading
  );
  const modal = useArtworkUpdate((state) => state.modal);
  const isDeleting = useArtworkUpdate((state) => state.isDeleting);
  const deleteArtwork = useArtworkUpdate((state) => state.deleteArtwork);
  const toggleModal = useArtworkUpdate((state) => state.toggleModal);
  const paramId = match.params.id;

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const globalClasses = globalStyles();

  const handleDeleteArtwork = async () => {
    await deleteArtwork({ artworkId: artwork.id });
    history.push("/");
    enqueueSnackbar(deleteArtwork.success.message, {
      variant: deleteArtwork.success.variant,
    });
  };

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {artworkLoading || capabilitiesLoading || artwork.id ? (
          <Grid item sm={12} style={{ height: "100%" }}>
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

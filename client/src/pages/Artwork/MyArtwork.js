import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import PromptModal from "../../components/PromptModal/index.js";
import ArtworkDatatable from "../../containers/ArtworkDatatable/index.js";
import { useUserUploads } from "../../contexts/local/userUploads";
import Container from "../../domain/Container";
import Grid from "../../domain/Grid";
import { deleteArtwork } from "../../services/artwork";
import globalStyles from "../../styles/global.js";
import { containsErrors, renderError } from "../../utils/helpers.js";

const MyArtwork = ({}) => {
  const modal = useUserUploads((state) => state.modal);
  const retry = useUserUploads((state) => state.uploads.error.retry);
  const redirect = useUserUploads((state) => state.uploads.error.redirect);
  const message = useUserUploads((state) => state.uploads.error.message);
  const isDeleting = useUserUploads((state) => state.isDeleting);
  const closeModal = useUserUploads((state) => state.closeModal);
  const removeArtwork = useUserUploads((state) => state.removeArtwork);
  const resetUploads = useUserUploads((state) => state.resetUploads);

  const { enqueueSnackbar } = useSnackbar();

  const globalClasses = globalStyles();

  const handleArtworkDelete = async () => {
    await removeArtwork({ artworkId: modal.id });
    enqueueSnackbar(deleteArtwork.success.message, {
      variant: deleteArtwork.success.variant,
    });
  };

  const reinitializeState = () => {
    resetUploads();
  };

  useEffect(() => {
    return () => {
      reinitializeState();
    };
  }, []);

  return !containsErrors(retry, redirect) ? (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12} className={globalClasses.elementWidth}>
          <ArtworkDatatable />
        </Grid>
      </Grid>
      <PromptModal
        open={modal.open}
        handleConfirm={handleArtworkDelete}
        handleClose={closeModal}
        ariaLabel="Delete artwork"
        promptTitle="Are you sure you want to delete this artwork?"
        promptConfirm="Delete"
        promptCancel="Cancel"
        isSubmitting={isDeleting}
      />
    </Container>
  ) : (
    renderError({ retry, redirect, message })
  );
};

export default MyArtwork;

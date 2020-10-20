import { Container, Grid } from "@material-ui/core";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/MainHeading.js";
import PromptModal from "../../components/PromptModal/PromptModal.js";
import EditArtworkForm from "../../containers/Artwork/EditArtworkForm.js";
import { UserContext } from "../../contexts/User.js";
import {
  deleteArtwork,
  editArtwork,
  patchArtwork,
} from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import globalStyles from "../../styles/global.js";
import { deleteEmptyValues } from "../../utils/helpers.js";

const initialState = {
  loading: true,
  isDeleting: false,
  artwork: {},
  fileInput: null,
  capabilities: {},
  modal: {
    open: false,
  },
};

const EditArtwork = ({ match, location }) => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({
    ...initialState,
  });

  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();

  const globalClasses = globalStyles();

  const fetchData = async () => {
    try {
      setState({ ...initialState });
      const {
        data: { artwork },
      } = await editArtwork.request({ artworkId: match.params.id });
      const {
        data: { capabilities },
      } = userStore.stripeId
        ? await getUser.request({ stripeId: userStore.stripeId })
        : { data: { capabilities: {} } };
      setState((prevState) => ({
        ...prevState,
        loading: false,
        artwork: artwork,
        capabilities: capabilities,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  const handleModalOpen = () => {
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, open: true },
    }));
  };

  const handleModalClose = () => {
    setState((prevState) => ({
      ...prevState,
      modal: { ...prevState.modal, open: false },
    }));
  };

  const handleDeleteArtwork = async () => {
    try {
      setState({ ...state, isDeleting: true });
      await deleteArtwork.request({
        artworkId: state.artwork._id,
        data: state.artwork.current._id,
      });
      history.push("/");
      enqueueSnackbar(deleteArtwork.success.message, {
        variant: deleteArtwork.success.variant,
      });
    } catch (err) {
      setState({ ...state, isDeleting: false });
      enqueueSnackbar(deleteArtwork.error.message, {
        variant: deleteArtwork.error.variant,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return (
    <Container key={location.key} className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        {state.loading || state.artwork._id ? (
          <Grid item sm={12}>
            <MainHeading
              text={"Edit artwork"}
              className={globalClasses.mainHeading}
            />
            <EditArtworkForm
              capabilities={state.capabilities}
              version={state.artwork.current}
              patchArtwork={patchArtwork}
              deleteEmptyValues={deleteEmptyValues}
              handleModalOpen={handleModalOpen}
              loading={state.loading}
            />
          </Grid>
        ) : (
          "Ne postoji"
        )}
      </Grid>
      <PromptModal
        open={state.modal.open}
        handleConfirm={handleDeleteArtwork}
        handleClose={handleModalClose}
        ariaLabel="Delete artwork"
        promptTitle="Are you sure you want to delete this artwork?"
        promptConfirm="Delete"
        promptCancel="Cancel"
      />
    </Container>
  );
};

export default EditArtwork;

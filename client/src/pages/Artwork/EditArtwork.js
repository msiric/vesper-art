import { Container, Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import MainHeading from "../../components/MainHeading/MainHeading.js";
import EditArtworkForm from "../../containers/Artwork/EditArtworkForm.js";
import { Context } from "../../contexts/Store.js";
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
};

const EditArtwork = ({ match, location }) => {
  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({
    ...initialState,
  });
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
      } = store.user.stripeId
        ? await getUser.request({ stripeId: store.user.stripeId })
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

  const handleDeleteArtwork = async () => {
    try {
      setState({ ...state, isDeleting: true });
      await deleteArtwork.request({
        artworkId: state.artwork._id,
        data: state.artwork.current._id,
      });
      history.push({
        pathname: "/",
        state: { message: "Artwork deleted" },
      });
    } catch (err) {
      setState({ ...state, isDeleting: false });
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
              user={store.user}
              patchArtwork={patchArtwork}
              deleteEmptyValues={deleteEmptyValues}
              handleDeleteArtwork={handleDeleteArtwork}
              loading={state.loading}
            />
          </Grid>
        ) : (
          "Ne postoji"
        )}
      </Grid>
    </Container>
  );
};

export default EditArtwork;

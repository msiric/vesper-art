import React, { useContext, useEffect, useState } from "react";
import MainHeading from "../../components/MainHeading/MainHeading.js";
import AddArtworkForm from "../../containers/Artwork/AddArtworkForm.js";
import { Context } from "../../context/Store.js";
import { postArtwork } from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import globalStyles from "../../styles/global.js";
import { Container, Grid } from "../../styles/theme.js";
import { deleteEmptyValues } from "../../utils/helpers.js";

const initialState = { capabilities: {} };

const AddArtwork = () => {
  const globalClasses = globalStyles();

  const [store, dispatch] = useContext(Context);
  const [state, setState] = useState({ ...initialState });

  const fetchAccount = async () => {
    try {
      const { data } = await getUser.request({ stripeId: store.user.stripeId });
      setState((prevState) => ({
        ...prevState,
        loading: false,
        capabilities: data.capabilities,
      }));
    } catch (err) {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  useEffect(() => {
    if (store.user.stripeId) fetchAccount();
  }, []);

  return (
    <Container className={globalClasses.gridContainer}>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <MainHeading
            text={"Add artwork"}
            className={globalClasses.mainHeading}
          />
          <AddArtworkForm
            capabilities={state.capabilities}
            user={store.user}
            postArtwork={postArtwork}
            deleteEmptyValues={deleteEmptyValues}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddArtwork;

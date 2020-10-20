import React, { useContext, useEffect, useState } from "react";
import MainHeading from "../../components/MainHeading/index.js";
import { UserContext } from "../../contexts/User.js";
import AddArtworkForm from "../../forms/ArtworkForm/AddArtworkForm.js";
import { postArtwork } from "../../services/artwork.js";
import { getUser } from "../../services/stripe.js";
import globalStyles from "../../styles/global.js";
import { Container, Grid } from "../../styles/theme.js";
import { deleteEmptyValues } from "../../utils/helpers.js";

const initialState = { capabilities: {} };

const AddArtwork = () => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({ ...initialState });

  const globalClasses = globalStyles();

  const fetchAccount = async () => {
    try {
      const { data } = await getUser.request({ stripeId: userStore.stripeId });
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
    if (userStore.stripeId) fetchAccount();
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
            postArtwork={postArtwork}
            deleteEmptyValues={deleteEmptyValues}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddArtwork;

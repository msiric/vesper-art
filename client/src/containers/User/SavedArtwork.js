import { Container, Grid, Paper, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.js";
import { UserContext } from "../../contexts/User.js";
import { getSaves } from "../../services/artwork.js";
import Gallery from "../Home/Gallery.js";
import SavedArtworkStyles from "./SavedArtwork.style.js";

const SavedArtwork = () => {
  const [userStore] = useContext(UserContext);
  const [state, setState] = useState({
    loading: true,
    artwork: [],
  });
  const history = useHistory();

  const classes = SavedArtworkStyles();

  const fetchUser = async () => {
    try {
      const { data } = await getSaves.request({ userId: userStore.id });
      setState({
        ...state,
        loading: false,
        artwork: data.savedArtwork,
      });
    } catch (err) {
      setState({ ...state, loading: false });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <Container className={classes.fixed}>
      <Grid container className={classes.container} spacing={2}>
        {state.loading ? (
          <Grid item xs={12} className={classes.loader}>
            <LoadingSpinner />
          </Grid>
        ) : (
          <>
            <Grid item sm={12} className={classes.grid}>
              <Paper className={classes.artwork} variant="outlined">
                <Typography variant="h6" align="center">
                  Saved artwork
                </Typography>
                {state.artwork.length ? (
                  <Gallery elements={state.artwork} type="artwork" />
                ) : (
                  <Typography variant="h6" align="center">
                    You have no saved artwork
                  </Typography>
                )}
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
};

export default SavedArtwork;
